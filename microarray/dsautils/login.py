"""
Function for authenticating a girder client instance.
"""
from girder_client import GirderClient


def login(apiurl, username=None, password=None):
    """Authenticate a girder client instance using username and password.

    Parameters
    ----------
    apiurl : str
        the DSA instance api url
    username : str (default: None)
        username to authenticate client with, if None then interactive authentication is used
    password : str (default: None)
        password to authenticate client with, if None then interactive authentication is used

    Return
    ------
    gc : girder_client.GirderClient
        authenticated girder client instance

    """
    gc = GirderClient(apiUrl=apiurl)

    if username is None or password is None:
        interactive = True
    else:
        interactive = False

    gc.authenticate(username=username, password=password, interactive=interactive)

    return gc
