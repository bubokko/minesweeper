interface JSONObject {
    [key: string]: JSONValue;
}

type JSONValue = string | number | boolean | null | JSONArray | JSONObject;

type JSONArray = JSONValue[];

export const jsonParseTyped = (json: string) => JSON.parse(json) as JSONValue;

export const softJsonParseTyped = (json: string) => {
    try {
        return jsonParseTyped(json);
    } catch {
        return undefined;
    }
};
