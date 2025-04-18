# frozen_string_literal: true

# name: discourse-random-usernames
# about: Create random usernames for new users
# version: 1.0
# authors: Communiteq
# url: https://github.com/communiteq/discourse-random-usernames

register_asset 'stylesheets/common/random-usernames.scss'

enabled_site_setting :random_usernames_enabled

after_initialize do
  module ::RandomUsernames
    class Generator
      def self.generate_unique_username(length, alphabet)
        safe_chars = alphabet.split('').uniq.to_a
        loop do
          username = Array.new(length) { safe_chars.sample }.join
          return username unless User.find_by_username_lower(username)
        end
      end
    end
  end

  add_model_callback(User, :before_create) do
    if SiteSetting.random_usernames_enabled?
      self.username = ::RandomUsernames::Generator.generate_unique_username(
        SiteSetting.random_usernames_length,
        SiteSetting.random_usernames_alphabet
      )
    end
  end
end
