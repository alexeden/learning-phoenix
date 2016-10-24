defmodule Rumbl.Video do
  use Rumbl.Web, :model

  @primary_key {:id, Rumbl.Permalink, autogenerate: true}

  schema "videos" do
    field :url, :string
    field :title, :string
    field :description, :string
    field :slug, :string
    belongs_to :user, Rumbl.User
    belongs_to :category, Rumbl.Category

    timestamps()
  end

  @allowed_params ~w(url title description slug category_id)
  @required_fields ~w(url title description)a

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, @allowed_params)
    |> slugify_title()
    |> assoc_constraint(:category)
    |> validate_required(@required_fields)
  end

  defp slugify_title(changeset) do
    if title = get_change(changeset, :title) do
      put_change(changeset, :slug, slugify(title))
    else
      changeset
    end
  end

  defp slugify(str) do
     str
     |> String.downcase()
     |> String.replace(~r/[^\w-]+/u, "-")
  end
end


defimpl Phoenix.Param, for: Rumbl.Video do
  @doc """
  Implements the Phoenix.Param protocol to allow
  custom URLs (slugs) of Rumbl.Video structs
  """
  def to_param(%{slug: slug, id: id}) do
    "#{id}-#{slug}"
  end
end
