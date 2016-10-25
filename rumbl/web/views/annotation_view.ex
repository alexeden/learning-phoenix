defmodule AnnotationView do
  use Rumbl.Web, :view

  def render("annotation.json", %{annotation: anno}) do
    %{
      id: anno.id,
      body: anno.body,
      at: anno.at,
      user: render_one(anno.user, Rumbl.UserView, "user.json")
    }
  end
end
