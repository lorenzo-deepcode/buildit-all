import os
from setuptools import setup, find_packages

from slickslack import __version__


def read(fname):
    return open(os.path.join(os.path.dirname(__file__), fname)).read()

requirements = []

setup(
    name="slickslack",
    version=".".join(map(str, __version__)),
    description="",
    long_description=read('README.md'),
    url='',
    license='MIT',
    author='buildit',
    #author_email='email@email.org',
    packages=find_packages(exclude=['tests']),
    include_package_data=True,
    classifiers=[
        'Development Status :: 3 - Alpha',
        'Environment :: Console',
        'Intended Audience :: Developers',
        'Intended Audience :: Information Technology',
        'License :: OSI Approved :: MIT License',
        'Operating System :: OS Independent',
        'Programming Language :: Python',
        #'Framework :: Django',
    ],
    install_requires=requirements,
    tests_require=[],
)
