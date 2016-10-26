defmodule Hecklr.SessionController do
  use Hecklr.Web, :controller

  def new(conn, _) do
    render conn, "new.html"
  end

  def create(conn, %{"session" => %{"username" => user, "password" => pass}}) do
    case Hecklr.Auth.login_by_username_and_pass(conn, user, pass, repo: Repo) do
      {:ok, conn} ->
        conn
        |> put_flash(:info, "You're in!")
        |> redirect(to: page_path(conn, :index))
      {:error, _reason, conn} ->
        conn
        |> put_flash(:error, "No go, yo")
        |> render("new.html")
    end
  end

  def delete(conn, _) do
    conn
    |> Hecklr.Auth.logout()
    |> redirect(to: page_path(conn, :index))
    |> put_flash(:info, "Kbai!")
  end

end
