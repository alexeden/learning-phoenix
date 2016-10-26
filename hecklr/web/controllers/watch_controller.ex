defmodule Hecklr.WatchController do
  use Hecklr.Web, :controller
  alias Hecklr.Video

  def show(conn, %{"id" => id}) do
    video = Repo.get!(Video, id)
    render conn, "show.html", video: video
  end
end
