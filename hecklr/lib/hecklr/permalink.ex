defmodule Hecklr.Permalink do
  @behaviour Ecto.Type
  @doc """
  Returns the underlying Ecto type
  In this case, the :id atom
  """
  def type, do: :id

  @doc """
  Called when external data is passed into Ecto
  Invoked when values in queries are interpolated or by the
  cast function in changesets
  """
  def cast(binary) when is_binary(binary) do
    case Integer.parse(binary) do
       {int, _} when int > 0 -> {:ok, int}
       _ -> :error
    end
  end

  def cast(integer) when is_integer(integer) do
    {:ok, integer}
  end

  def cast(_) do
    :error
  end

  @doc """
  Invoked when data is sent to the database
  """
  def dump(integer) when is_integer(integer) do
    {:ok, integer}
  end

  @doc """
  Invoked when data is loaded from the database
  """
  def load(integer) when is_integer(integer) do
    {:ok, integer}
  end
end
