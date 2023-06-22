migrate((db) => {
  const collection = new Collection({
    "id": "3tddxfusiehez6y",
    "created": "2023-06-22 04:34:11.428Z",
    "updated": "2023-06-22 04:34:11.428Z",
    "name": "formBlueprints",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "aozxsmiz",
        "name": "title",
        "type": "text",
        "required": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "xfads3ra",
        "name": "fields",
        "type": "json",
        "required": false,
        "unique": false,
        "options": {}
      },
      {
        "system": false,
        "id": "ychccijs",
        "name": "submissionLimit",
        "type": "date",
        "required": false,
        "unique": false,
        "options": {
          "min": "",
          "max": ""
        }
      },
      {
        "system": false,
        "id": "xvost1vb",
        "name": "user_id",
        "type": "relation",
        "required": false,
        "unique": false,
        "options": {
          "collectionId": "_pb_users_auth_",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": null,
          "displayFields": []
        }
      }
    ],
    "indexes": [],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("3tddxfusiehez6y");

  return dao.deleteCollection(collection);
})
