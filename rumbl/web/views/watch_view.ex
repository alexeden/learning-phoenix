defmodule Rumbl.WatchView do
  use Rumbl.Web, :view

  @player_id_regex ~r{^.*(?:youtu\.be/|\w+/|v=)(?<id>[^#&?]*)}

  def player_id(video) do
    @player_id_regex
    |> Regex.named_captures(video.url)
    |> get_in(["id"])
  end

end
