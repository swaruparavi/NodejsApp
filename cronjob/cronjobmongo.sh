export CONTAINER_NAME="mongo"
export DATABASE_NAME="access"

docker exec -i ${CONTAINER_NAME} mongo ${DATABASE_NAME} --eval "printjson(db.errorCount.find({},{count:4}).toArray())"  >>  testoutput.txt

a=$(tail -n 1 testoutput.txt)

ls=$(echo $a | cut -d' ' -f8)

if [ $ls -gt 10 ]
then
echo "Hello, The no of access denials crossed 10" | mail -s "The no of access denials" swarupadevops@gmail.com
fi