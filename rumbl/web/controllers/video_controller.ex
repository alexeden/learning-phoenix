defmodule Rumbl.VideoController do
  use Rumbl.Web, :controller
  alias Rumbl.Video
  alias Rumbl.Category

  plug :load_categories when action in [:new, :create, :edit, :update]
  plug :scrub_params, "video" when action in [:create, :update]

  def action(conn, _) do
    apply(__MODULE__, action_name(conn), [conn, conn.params, conn.assigns.current_user])
  end

  defp user_video_by_id(user, video_id) do
    user
      |> assoc(:videos)
      |> Repo.get!(video_id)
  end

  defp load_categories(conn, _) do
    categories =
      Category
      |> Category.alphabetical
      |> Category.names_and_ids
      |> Repo.all
    IO.puts "Categories: #{inspect categories}"

    assign(conn, :categories, categories)
  end

  def index(conn, _params, user) do
    videos =
      Repo.all from v in Video,
        join: assoc(v, :user),
        join: assoc(v, :category),
        preload: [:category]

    render(conn, "index.html", videos: videos, user: user)
  end

  def new(conn, _params, user) do
    # Attach an association with the current user to the new changeset
    changeset =
      user
      |> build_assoc(:videos)
      |> Video.changeset()

    render(conn, "new.html", changeset: changeset)
  end

  def create(conn, %{"video" => video_params}, user) do
    changeset =
      user
      |> build_assoc(:videos)
      |> Video.changeset(video_params)

    case Repo.insert(changeset) do
      {:ok, _video} ->
        conn
        |> put_flash(:info, "Video created successfully.")
        |> redirect(to: video_path(conn, :index))
      {:error, changeset} ->
        render(conn, "new.html", changeset: changeset)
    end
  end

  def show(conn, %{"id" => id}, user) do
    video = user_video_by_id(user, id)
    render(conn, "show.html", video: video)
  end

  def edit(conn, %{"id" => id}, user) do
    video = user_video_by_id(user, id)
    changeset = Video.changeset(video)
    render(conn, "edit.html", video: video, changeset: changeset)
  end

  def update(conn, %{"id" => id, "video" => video_params}, user) do
    IO.puts "Updating video with params: #{inspect video_params}"
    video = user_video_by_id(user, id)
    changeset = Video.changeset(video, video_params)

    case Repo.update(changeset) do
      {:ok, video} ->
        conn
        |> put_flash(:info, "Video updated successfully.")
        |> redirect(to: video_path(conn, :show, video))
      {:error, changeset} ->
        render(conn, "edit.html", video: video, changeset: changeset)
    end
  end

  def delete(conn, %{"id" => id}, user) do
    video = user_video_by_id(user, id)

    # Here we use delete! (with a bang) because we expect
    # it to always work (and if it does not, it will raise).
    Repo.delete!(video)

    conn
    |> put_flash(:info, "Video deleted successfully.")
    |> redirect(to: video_path(conn, :index))
  end
end
