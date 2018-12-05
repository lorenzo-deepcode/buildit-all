INSERT INTO bookable (id, location_id, name, closed, reason)
VALUES ('cd87ee34-b393-4400-a1c9-d91278d4b8ee', 'b1177996-75e2-41da-a3e9-fcdd75d1ab31', 'Dev Red', FALSE, '');
INSERT INTO bookable (id, location_id, name, closed, reason)
VALUES ('bf16f7d9-d0ee-4333-86ff-5a97c75b4424', 'b1177996-75e2-41da-a3e9-fcdd75d1ab31', 'Dev Blue', FALSE, '');
INSERT INTO bookable (id, location_id, name, closed, reason)
VALUES ('bfa745f7-cb86-493a-98b4-984173a9ab01', 'b1177996-75e2-41da-a3e9-fcdd75d1ab31', 'Dev White', FALSE, '');
INSERT INTO bookable (id, location_id, name, closed, reason)
VALUES ('3aceeedc-5302-4b32-b653-a7ee1d8eab6c', 'b1177996-75e2-41da-a3e9-fcdd75d1ab31', 'Dev Black', FALSE, '');
INSERT INTO bookable (id, location_id, name, closed, reason) VALUES
    ('6bdb5c82-134b-4328-b590-95133f887134', '43ec3f7d-348d-427f-8c13-102ca0362a62', 'Dev Elizabeth Conference', FALSE,
     '');
INSERT INTO bookable (id, location_id, name, closed, reason)
VALUES ('261b4bdc-6288-4315-bd77-92420a9f3fbd', '43ec3f7d-348d-427f-8c13-102ca0362a62', 'Dev Thames Planning', FALSE, '');
INSERT INTO bookable (id, location_id, name, closed, reason)
VALUES ('dd947975-4dee-4404-9daa-76f5d7b76684', '43ec3f7d-348d-427f-8c13-102ca0362a62', 'Dev Very Splendid', FALSE, '');
INSERT INTO bookable (id, location_id, name, closed, reason) VALUES
    ('0308b2aa-8aef-40d4-99af-d7cae8318523', '43ec3f7d-348d-427f-8c13-102ca0362a62', 'Dev Tower of London Spooky', FALSE,
     '');

INSERT INTO user (id, external_id, given_name, family_name)
VALUES ('ff9391f6-a99b-43c4-8e75-9c91bada5397', '160e0263-4f83-4a99-a2e5-177cd7e96d16', 'Doe', 'Jane');

INSERT INTO booking (id, bookable_id, subject, start, end, user_id) VALUES
    ('e081f498-151b-49bf-a302-6cf248c991f3', 'cd87ee34-b393-4400-a1c9-d91278d4b8ee', 'My Booking',
     {fn TIMESTAMPADD(SQL_TSI_HOUR, -24, CURRENT_DATE)}, {fn TIMESTAMPADD(SQL_TSI_HOUR, -23, CURRENT_DATE)}, 'ff9391f6-a99b-43c4-8e75-9c91bada5397');
INSERT INTO booking (id, bookable_id, subject, start, end, user_id) VALUES
    ('989fa334-7b8c-4dec-8be7-adf5e2302f39', 'cd87ee34-b393-4400-a1c9-d91278d4b8ee', 'Another Booking',
     {fn TIMESTAMPADD(SQL_TSI_HOUR, 1, CURRENT_DATE)}, {fn TIMESTAMPADD(SQL_TSI_HOUR, 2, CURRENT_DATE)}, 'ff9391f6-a99b-43c4-8e75-9c91bada5397');
INSERT INTO booking (id, bookable_id, subject, start, end, user_id) VALUES
    ('c52c0fd4-9fdc-4d55-973c-2ba340c8edf6', 'bf16f7d9-d0ee-4333-86ff-5a97c75b4424', 'Plan All Things',
     {fn TIMESTAMPADD(SQL_TSI_HOUR, 3, CURRENT_DATE)}, {fn TIMESTAMPADD(SQL_TSI_HOUR, 4, CURRENT_DATE)}, 'ff9391f6-a99b-43c4-8e75-9c91bada5397');
INSERT INTO booking (id, bookable_id, subject, start, end, user_id) VALUES
    ('9c73c6a9-b08d-416f-a401-d7c8a8279d13', 'bf16f7d9-d0ee-4333-86ff-5a97c75b4424', 'Execute Proletariat',
     {fn TIMESTAMPADD(SQL_TSI_HOUR, 7, CURRENT_DATE)}, {fn TIMESTAMPADD(SQL_TSI_HOUR, 8, CURRENT_DATE)}, 'ff9391f6-a99b-43c4-8e75-9c91bada5397');
INSERT INTO booking (id, bookable_id, subject, start, end, user_id) VALUES
    ('2e46deec-a1d7-4842-a3e3-633032b50bf4', 'bfa745f7-cb86-493a-98b4-984173a9ab01', 'Wash Hands',
     {fn TIMESTAMPADD(SQL_TSI_HOUR, 24, CURRENT_DATE)}, {fn TIMESTAMPADD(SQL_TSI_HOUR, 25, CURRENT_DATE)}, 'ff9391f6-a99b-43c4-8e75-9c91bada5397');

