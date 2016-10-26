defmodule Hecklr.Auth do
  @moduledoc """
  Encapsulates all of our authentication logic
  """

  import Plug.Conn
  import Comeonin.Bcrypt, only: [checkpw: 2, dummy_checkpw: 0]
  import Phoenix.Controller
  alias Hecklr.Router.Helpers

  # We'll make this authenticate function into a function plug
  def authenticate_user(conn, _opts) do
    if conn.assigns.current_user do
      conn
    else
      conn
      |> put_flash(:error, "You gotta be logged in!")
      |> redirect(to: Helpers.page_path(conn, :index))
      |> halt()
    end
  end

  def init(opts) do
    # Hecklr.Auth always requires a :repo option
    Keyword.fetch!(opts, :repo)
  end

  def call(conn, repo) do
    user_id = get_session(conn, :user_id)

    cond do
      user = conn.assigns[:current_user] ->
        put_current_user(conn, user)

      user = user_id && repo.get(Hecklr.User, user_id) ->
        put_current_user(conn, user)

      true ->
        assign(conn, :current_user, nil)
    end
  end

  @doc """
  Receives the connection and the user, and stores the user ID
  in the session
  """
  def login(conn, user) do
    conn
    |> put_current_user(user)
    |> put_session(:user_id, user.id)
    |> configure_session(renew: true)
  end

  defp put_current_user(conn, user) do
    token = Phoenix.Token.sign(conn, "user socket", user.id)

    conn
    |> assign(:current_user, user)
    |> assign(:user_token, token)
  end

  def login_by_username_and_pass(conn, username, given_pass, opts) do
    repo = init(opts)
    user = repo.get_by(Hecklr.User, username: username)

    cond do
      user && checkpw(given_pass, user.password_hash) ->
        {:ok, login(conn, user)}
      user ->
        {:error,  :unauthorized, conn}
      true ->
        dummy_checkpw()
        {:error, :not_found, conn}
    end
  end

  def logout(conn) do
    configure_session(conn, drop: true)
  end
end
