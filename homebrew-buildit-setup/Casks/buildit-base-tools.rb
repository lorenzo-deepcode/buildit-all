cask 'buildit-base-tools' do
  version '0.0.1'
  sha256 :no_check
  url "https://s3.eu-west-2.amazonaws.com/homebrew-buildit-setup/homebrew-buildit-setup.tar.gz"
  name 'Buildit Base Tools - Automation of Mac setup as a Cask'

  depends_on formula: "git"
  depends_on formula: "bash-completion"
  depends_on formula: "python"
  depends_on formula: "ansible"
  depends_on formula: "terraform"
  depends_on formula: "awscli"
  depends_on formula: "packer"
  depends_on formula: "docker"
  depends_on formula: "chromedriver"

  depends_on cask: "dropbox"
  depends_on cask: "google-chrome"
  depends_on cask: "firefox"
  depends_on cask: "atom"
  depends_on cask: "skype"
  depends_on cask: "slack"
  depends_on cask: "tunnelblick"
  depends_on cask: "vagrant"

  caveats do
    <<~EOS
    Manual steps needed and not covered by the cask:

    For bash-completion, do:
    Add the following line to your ~/.bash_profile:
      [ -f /usr/local/etc/bash_completion ] && . /usr/local/etc/bash_completion

    You will need to configure Git with your username details:
    Add the following lines to your ~/.gitconfig:
      [user]
        name = <Your Name>
        email = <your_email@wipro.com>
    Create a ~/.gitignore file with the content below:
      # ignore Mac OS X .DS_Store files
      .DS_Store
      # Ignore JetBrains project directories
      /.idea
    Add this file to your Git ignore with the command below:
      git config --global core.excludesfile ~/.gitignore_global

    For AWS config, add the following lines to your ~/.bash_profile
      export AWS_ACCESS_KEY_ID=<Your requested AWS access ID>
      export AWS_SECRET_ACCESS_KEY=<Your requested secret access key>
    Or use your prefered way of configuring AWS (i.e. credential file)
    EOS
  end
end
