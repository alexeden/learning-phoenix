# Script for populating the database. You can run it as:
#
#     mix run priv/repo/seeds.exs
#
# Inside the script, you can read and write to any of your
# repositories directly:
#
#     Hecklr.Repo.insert!(%Hecklr.SomeModel{})
#
# We recommend using the bang functions (`insert!`, `update!`
# and so on) as they will fail if something goes wrong.

alias Hecklr.Repo
alias Hecklr.Category

for category <- ~w(Code Funny Music) do
  Repo.insert!(%Category{ name: category })
end
