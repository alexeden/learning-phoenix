defmodule Hecklr.PageController do
  use Hecklr.Web, :controller

  def index(conn, _params) do
    render conn, "index.html"
  end
end
