# personal-website
Clint's website: https://clintonmorrison.com


### Running locally
First time setup (Macbook):
```bash
brew install mysql pkg-config
```

To run the server in local dev mode:
```bash
cd ~/Source/personal-website
./run_local_dev.sh

# Alternatively:
python3 -m venv venv
source venv/bin/activate
pip3 install -r app/requirements.txt
cd app
python3 dev_server.py
```

### Building container
Update the version in `version.sh`
```
cd ~/Source/personal-website
./build.sh
```