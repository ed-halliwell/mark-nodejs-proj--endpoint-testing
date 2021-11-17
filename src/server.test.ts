import supertest from "supertest";
import app from "./server";
import { MYSTERIOUS_ROBED_FIGURE } from "./constants/characters";
import { CAVE_EXTERIOR } from "./constants/locations";

test("GET / responds with a welcome message from our mysterious robed figure", async () => {
  const response = await supertest(app).get("/");

  expect(response.body).toStrictEqual({
    location: CAVE_EXTERIOR,
    speech: {
      speaker: MYSTERIOUS_ROBED_FIGURE,
      text: "Welcome, young adventurer, to the ENDPOINT ADVENTURE. Are you ready for this quest?",
    },
    options: {
      yes: "/quest/accept",
      no: "/quest/decline",
      help: "/help",
    },
  });
});

test("GET /quest/accept has our mysterious robed figure give a couple of further choices", async () => {
  const response = await supertest(app).get("/quest/accept");

  // check the speaker and location are right
  expect(response.body).toMatchObject({
    location: CAVE_EXTERIOR,
    speech: {
      speaker: MYSTERIOUS_ROBED_FIGURE,
    },
  });

  // check the robed figure is saying something
  expect(typeof response.body.speech.text).toBe("string");

  // check that there are at least two further options
  expect(Object.keys(response.body.options).length).toBeGreaterThanOrEqual(2);
});

test("GET /quest/start/easy responds some rookie information", async () => {
  const response = await supertest(app).get("/quest/start/easy");

  // check the speaker and location are right
  expect(response.body).toMatchObject({
    location: CAVE_EXTERIOR,
    speech: {
      speaker: MYSTERIOUS_ROBED_FIGURE,
    },
  });

  // check the robed figure is saying something
  expect(typeof response.body.speech.text).toBe("string");

  // check that there are at least one further option
  expect(Object.keys(response.body.options).length).toBeGreaterThanOrEqual(1);
});

test("GET /quest/start/hard responds some challenging information", async () => {
  const response = await supertest(app).get("/quest/start/hard");

  // check the speaker and location are right
  expect(response.body).toMatchObject({
    location: CAVE_EXTERIOR,
    speech: {
      speaker: MYSTERIOUS_ROBED_FIGURE,
    },
  });

  // check the robed figure is saying something
  expect(typeof response.body.speech.text).toBe("string");

  // check that there are at least one further option
  expect(Object.keys(response.body.options).length).toBeGreaterThanOrEqual(1);
});

test("GET /quest/decline responds with an apocalyptic message", async () => {
  const response = await supertest(app).get("/quest/decline");

  // located in the apocalypse
  expect(response.body.location).toBe("Apocalypse");

  // aggro speaker
  expect(response.body.speech.speaker.name).toBe("Titan, Destroyer of Worlds");

  // some aggro message
  expect(response.body.speech.text).toMatch("FOOL");
  expect(response.body.speech.text).toMatch(/mistake/i);

  // only includes the option to restart
  expect(response.body.options).toStrictEqual({ restart: "/" });
});

test("GET /quest/start/impossible responds with instant 'death'", async () => {
  const response = await supertest(app).get("/quest/start/impossible");

  // there is _some_ location
  expect(response.body.location).toMatch(/hell/i);

  // there is _some_ speaker
  expect(response.body.speech.speaker.name).toStrictEqual("Death");

  // instant death
  expect(response.body.speech.text).toMatch(/instant/i);

  // includes option to restart
  expect(response.body.options).toMatchObject({ restart: "/" });
});

test("GET /help responds with some helpful information", async () => {
  const response = await supertest(app).get("/help");

  // there is _some_ location
  expect(response.body.location).toMatch("Handforth Parish Council");

  // there is _some_ speaker
  expect(response.body.speech.speaker.name).toMatch(/Jackie Weaver/i);

  // some helpful text
  expect(response.body.speech.text).toMatch(
    "When you visit an endpoint, you're presented with a scene"
  );

  // includes option to restart
  expect(response.body.options).toMatchObject({ backToStart: "/" });
});
