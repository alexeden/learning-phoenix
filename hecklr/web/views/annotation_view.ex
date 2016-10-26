defmodule AnnotationView do
  use Hecklr.Web, :view

  def render("annotation.json", %{annotation: anno}) do
    %{
      id: anno.id,
      body: anno.body,
      at: anno.at,
      user: render_one(anno.user, Hecklr.UserView, "user.json")
    }
  end
end
