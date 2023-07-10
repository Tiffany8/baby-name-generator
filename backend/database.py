import json
from models import NameResults
from bson.objectid import ObjectId


async def create_name_results(client, name_results: str) -> dict:
    name_results_dict = json.loads(name_results)
    name_result = await client.name_results_collection.insert_one(name_results_dict)
    new_name_result = await client.name_results_collection.find_one(
        {"_id": name_result.inserted_id}
    )
    result = name_result_helper(new_name_result)
    return result


async def get_name_results_by_id(client, id: str) -> NameResults:
    name_result = await client.name_results_collection.find_one({"_id": ObjectId(id)})
    return name_result_helper(name_result)


def name_result_helper(name_result: dict) -> dict:
    name_result["id"] = str(name_result["_id"])
    del name_result["_id"]
    return name_result
