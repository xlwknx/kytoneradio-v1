# kytoneradio

### infa
central-srv.p-s.org.ua:15002
ssh -p 15022 curator@central-srv.p-s.org.ua


### Start

vagrant up
npm install --no-bin-links

### structure
./icecast
./liquidsoap
./logs
./music
./web
- server
    - config
    - routes
    - app
- source (gulp)
- public (resources folder)
- service
- views
- www (exec)
