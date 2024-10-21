# NPF - National Portal Framework

### Mongodb Seeder

## How to prepare seed data
create document file under `src/documents` folder. the `file name` should be matched with `mongodb collection` name like below.
```bash
$ sudo touch aptitude_test_questions.ts
```
then 
```javascript
import { ObjectId } from 'mongodb';

export default [
  {
    number_of_question: 27,
    duration: 25,
  }
];
```
it should an array even if it's single document.


### if you want to copy and paste old document then follow the instruction.
- copy docs like
```json
[
  {
    "_id": {
      "$oid": "6368ae0dd33d4816beff8704"
    },
    "number_of_question": 27,
    "duration": 25
  }
]
```
- paste
```javascript
[
  {
    _id: {
      $oid: "6368ae0dd33d4816beff8704"
    },
    number_of_question: 27,
    duration: 25
  }
]
```
- replace all `$oid to ObjectId` using regex in find bar
```regexp
_id: \{\n.+\$oid\: ('\w.+),\n.*
```
- then replace bar
```regexp
_id: new ObjectId($1),
```
- import `import { ObjectId } from 'mongodb';`

That's all


### run 
```bash
$ yarn start api-seeders
```
