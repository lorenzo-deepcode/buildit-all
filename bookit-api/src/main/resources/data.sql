INSERT INTO user (id, external_id, given_name, family_name)
VALUES ('c40c724e-36c3-465f-9094-6e02e13d1802', '86d86868-9308-4b49-ac78-7b920abbbda6', 'Fake', 'DB user')
ON DUPLICATE KEY UPDATE external_id = external_id;

INSERT INTO location (id, name, time_zone) VALUES ('b1177996-75e2-41da-a3e9-fcdd75d1ab31', 'NYC', 'America/New_York')
ON DUPLICATE KEY UPDATE name = name;
INSERT INTO location (id, name, time_zone) VALUES ('43ec3f7d-348d-427f-8c13-102ca0362a62', 'LON', 'Europe/London')
ON DUPLICATE KEY UPDATE name = name;
INSERT INTO location (id, name, time_zone) VALUES ('439c3fe8-124f-4a44-8f97-662a5d8334d3', 'DEN', 'America/Denver')
ON DUPLICATE KEY UPDATE name = name;

INSERT INTO bookable (id, location_id, name, closed, reason)
VALUES ('3db27fe2-ad9f-44ca-bcb8-c30829007563', '439c3fe8-124f-4a44-8f97-662a5d8334d3', 'Suite 2170', FALSE, '')
ON DUPLICATE KEY UPDATE name = name;


INSERT INTO bookable (id, location_id, name, closed, reason)
VALUES ('aab6d676-d3cb-4b9b-b285-6e63058aeda8', 'b1177996-75e2-41da-a3e9-fcdd75d1ab31', 'Red Room', FALSE, '')
ON DUPLICATE KEY UPDATE name = name;
INSERT INTO bookable (id, location_id, name, closed, reason)
VALUES ('1c824c61-7539-41d7-b723-d4447826ba50', 'b1177996-75e2-41da-a3e9-fcdd75d1ab31', 'Black Room', FALSE, '')
ON DUPLICATE KEY UPDATE name = name;
INSERT INTO bookable (id, location_id, name, closed, reason)
VALUES ('23787564-e99d-4741-b285-4d17cc29bf8d', 'b1177996-75e2-41da-a3e9-fcdd75d1ab31', 'Blue Room', FALSE, '')
ON DUPLICATE KEY UPDATE name = name;
INSERT INTO bookable (id, location_id, name, closed, reason)
VALUES ('a7b68976-8dda-44f2-8e39-4e2b6c3514cd', 'b1177996-75e2-41da-a3e9-fcdd75d1ab31', 'Green Room', FALSE, '')
ON DUPLICATE KEY UPDATE name = name;
INSERT INTO bookable (id, location_id, name, closed, reason)
VALUES ('25708e84-cf1b-45aa-b062-0af903328a52', 'b1177996-75e2-41da-a3e9-fcdd75d1ab31', 'White Room', FALSE, '')
ON DUPLICATE KEY UPDATE name = name;
INSERT INTO bookable (id, location_id, name, closed, reason)
VALUES ('cc4bd7e5-00f6-4903-86a2-abf5423edb84', 'b1177996-75e2-41da-a3e9-fcdd75d1ab31', 'Yellow Room', TRUE, 'Not bookable (ad-hoc)')
ON DUPLICATE KEY UPDATE name = name;
INSERT INTO bookable (id, location_id, name, closed, reason)
VALUES ('86d0eb7c-cce0-400a-b413-72f19ba11230', 'b1177996-75e2-41da-a3e9-fcdd75d1ab31', 'Randolph Room', TRUE, 'Out of beer!')
ON DUPLICATE KEY UPDATE name = name;

INSERT INTO bookable (id, location_id, name, closed, reason)
VALUES ('dddc584f-6723-43ed-a8c9-3a39ab366d56', '43ec3f7d-348d-427f-8c13-102ca0362a62', 'Richmond', FALSE, '')
ON DUPLICATE KEY UPDATE name = name;
INSERT INTO bookable (id, location_id, name, closed, reason)
VALUES ('6a50b92d-c8b3-4126-85a1-89669c24401e', '43ec3f7d-348d-427f-8c13-102ca0362a62', 'Battersea', FALSE, '')
ON DUPLICATE KEY UPDATE name = name;
INSERT INTO bookable (id, location_id, name, closed, reason)
VALUES ('e5212ab7-da62-4479-806b-a69458ce29ff', '43ec3f7d-348d-427f-8c13-102ca0362a62', 'Hyde', FALSE, '')
ON DUPLICATE KEY UPDATE name = name;
INSERT INTO bookable (id, location_id, name, closed, reason)
VALUES ('9dd5f9c1-6e18-4024-b94c-4eabf80d0120', '43ec3f7d-348d-427f-8c13-102ca0362a62', 'Holland', FALSE, '')
ON DUPLICATE KEY UPDATE name = name;
INSERT INTO bookable (id, location_id, name, closed, reason)
VALUES ('53bb0ae3-3514-4989-b5cb-5b6b9b2dfbcf', '43ec3f7d-348d-427f-8c13-102ca0362a62', 'Regents', FALSE, '')
ON DUPLICATE KEY UPDATE name = name;
INSERT INTO bookable (id, location_id, name, closed, reason)
VALUES ('d7b6533e-6176-4ee1-a477-ed6579962c15', '43ec3f7d-348d-427f-8c13-102ca0362a62', 'Hampstead', FALSE, '')
ON DUPLICATE KEY UPDATE name = name;
INSERT INTO bookable (id, location_id, name, closed, reason)
VALUES ('bbebd6c3-0152-4d9d-9221-c0eb96da2d30', '43ec3f7d-348d-427f-8c13-102ca0362a62', 'Bletchley', FALSE, '')
ON DUPLICATE KEY UPDATE name = name;
INSERT INTO bookable (id, location_id, name, closed, reason)
VALUES ('1533981c-5349-4ef4-ba34-6ed6b62382d7', '43ec3f7d-348d-427f-8c13-102ca0362a62', 'Victoria', FALSE, '')
ON DUPLICATE KEY UPDATE name = name;
INSERT INTO bookable (id, location_id, name, closed, reason)
VALUES ('8d3a3477-3c22-4523-8ea2-6ae0fefa1ef6', '43ec3f7d-348d-427f-8c13-102ca0362a62', 'Olympic', FALSE, '')
ON DUPLICATE KEY UPDATE name = name;
INSERT INTO bookable (id, location_id, name, closed, reason)
VALUES ('16ca7274-0c60-4c5c-913e-5ed3506f59ad', '43ec3f7d-348d-427f-8c13-102ca0362a62', 'Greenwich', FALSE, '')
ON DUPLICATE KEY UPDATE name = name;
INSERT INTO bookable (id, location_id, name, closed, reason)
VALUES ('8db0eb1a-17b7-4b1a-87b6-e2e15e885bb0', '43ec3f7d-348d-427f-8c13-102ca0362a62', 'Crystal Palace', FALSE, '')
ON DUPLICATE KEY UPDATE name = name;
