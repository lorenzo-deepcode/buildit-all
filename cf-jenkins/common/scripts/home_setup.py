from distutils.dir_util import copy_tree

JENKINS_HOME = "/home/vcap/.jenkins"
SOURCE = "home"

def setup(source=SOURCE, destination=JENKINS_HOME):
    copy_tree(source, destination)
