#!/usr/bin/env python
import os
import tempfile
import unittest

from scripts import home_setup


class TestHomeSetup(unittest.TestCase):

    def setUp(self):
        self.source = tempfile.mkdtemp()
        self.destination = tempfile.mkdtemp()
        self.filepath = tempfile.mkstemp(dir=self.source)[1]

    def test_copy(self):
        home_setup.setup(self.source, self.destination)
        file_listing = os.listdir(self.destination)

        self.assertTrue(os.path.basename(self.filepath) in file_listing)
