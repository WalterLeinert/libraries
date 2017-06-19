registry=localhost:4873
username="walter"
password="walter"
email="walter.leinert@outlook.com"

TOKEN=$(curl -s \
	-H "Accept: application/json" \
	-H "Content-Type:application/json" \
	-X PUT --data '{"name": "${username}", "password": "${ßpassword}"}' \
	http://${registry}/-/user/org.couchdb.user:username_here 2>&1 | grep -Po \
	  '(?<="token": ")[^"]*')

npm set registry "http://${registry}"
npm set //${registry}/:_authToken $TOKEN

