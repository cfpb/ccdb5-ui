import os
from setuptools import setup, find_packages
from subprocess import check_output


command = 'git describe --tags --long --dirty --always'
fmt = '{tag}.dev{commitcount}+{gitsha}'


def format_version(version, fmt=fmt):
    parts = version.split('-')

    # This is an unknown fork/branch being run in the CI
    if len(parts) == 1:
        return fmt.format(tag='ci', commitcount=0, gitsha=version)

    assert len(parts) in (3, 4)
    dirty = len(parts) == 4
    tag, count, sha = parts[:3]
    if count == '0' and not dirty:
        return tag
    return fmt.format(tag=tag, commitcount=count, gitsha=sha.lstrip('g'))


def get_git_version():
    git_version = check_output(command.split()).decode('utf-8').strip()
    return format_version(version=git_version)


def read_file(filename):
    """Read a file into a string"""
    path = os.path.abspath(os.path.dirname(__file__))
    filepath = os.path.join(path, filename)
    try:
        return open(filepath).read()
    except IOError:
        return ''


setup(
    name='ccdb5_ui',
    version='2.3.3-dev5',
    author='CFPB',
    author_email='tech@cfpb.gov',
    maintainer='cfpb',
    maintainer_email='tech@cfpb.gov',
    packages=find_packages(),
    package_data={
        'ccdb5_ui': [
            'templates/index.html',
            'static/*'
        ]
    },
    include_package_data=True,
    description=u'Consumer Complaint Database UI',
    classifiers=[
        'Intended Audience :: Developers',
        'Programming Language :: Python',
        'Programming Language :: Python :: 3.6',
        'Framework :: Django',
        'Development Status :: 4 - Beta',
        'Operating System :: OS Independent',
    ],
    long_description=read_file('README.md'),
    zip_safe=False,
    setup_requires=['cfgov_setup==1.2'],
    install_requires=[
        'Django>=2.2,<3.2',
        'django-flags>=4.0.1,<5.1',
    ],
    frontend_build_script='frontendbuild.sh'
)
