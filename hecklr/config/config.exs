# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.
use Mix.Config

# General application configuration
config :hecklr,
  ecto_repos: [Hecklr.Repo]

# Configures the endpoint
config :hecklr, Hecklr.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "eYj1piub6+s3OEc57dsOgYbbq9Kc7z9/ChTElCGVobol23/CtaG4AQ6A2OM93PkB",
  render_errors: [view: Hecklr.ErrorView, accepts: ~w(html json)],
  pubsub: [name: Hecklr.PubSub,
           adapter: Phoenix.PubSub.PG2]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env}.exs"
