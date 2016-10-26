defmodule Hecklr.UserController do
  use Hecklr.Web, :controller
  alias Hecklr.User
  alias Hecklr.Auth

  # Attach the authenticate function plug to the :index and :show actions
  plug :authenticate_user when action in [:index, :show]

  def index(conn, _params) do
    # users = Repo.all(User)
    users =
      Repo.all from u in User,
        join: v in assoc(u, :videos),
        join: c in assoc(v, :category),
        preload: [videos: {v, category: c}]

    render conn, "index.html", users: users
  end

  def show(conn, %{"id" => id}) do
    user = Repo.get(User, id)
    render conn, "show.html", user: user
  end

  def new(conn, _params) do
    changeset = User.changeset(%User{})
    render conn, "new.html", changeset: changeset
  end

  def create(conn, %{"user" => user_params}) do
    changeset = Hecklr.User.registration_changeset(%User{}, user_params)
    case Repo.insert(changeset) do
      {:ok, user} ->
        conn
        |> Hecklr.Auth.login(user)
        |> put_flash(:info, "#{user.name} created!")
        |> redirect(to: user_path(conn, :index))
      {:error, changeset} ->
        render(conn, "new.html", changeset: changeset)
    end
  end

end
