defmodule Hecklr.Annotation do
  use Hecklr.Web, :model

  schema "annotations" do
    field :body, :string
    field :at, :integer
    belongs_to :user, Hecklr.User
    belongs_to :video, Hecklr.Video

    timestamps()
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:body, :at])
    |> validate_required([:body, :at])
  end
end
