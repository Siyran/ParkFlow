INSERT INTO users (name, email, password_hash, phone, role, wallet_balance)
VALUES
  ('Demo Owner', 'owner1@parkflow.local', 'hash', '9900000001', 'owner', 0),
  ('Demo User', 'user1@parkflow.local', 'hash', '9900000002', 'user', 0);

INSERT INTO parking_spots (owner_id, name, address, latitude, longitude, type, total_slots, available_slots, is_active)
VALUES
  (1, 'Residency Road Covered Parking', 'Residency Road, Srinagar', 34.0837000, 74.7973000, 'covered', 8, 5, TRUE),
  (1, 'Lal Chowk Open Yard', 'Lal Chowk, Srinagar', 34.0798000, 74.8012000, 'open', 12, 7, TRUE),
  (1, 'Rajbagh Basement Slots', 'Rajbagh, Srinagar', 34.0654000, 74.8236000, 'basement', 10, 4, TRUE),
  (1, 'Boulevard Lake View Parking', 'Boulevard Road, Srinagar', 34.0915000, 74.8523000, 'open', 15, 10, TRUE),
  (1, 'TRC Multilevel Parking', 'TRC Grounds, Srinagar', 34.0679000, 74.7968000, 'covered', 20, 14, TRUE),
  (1, 'Airport Road Daily Parking', 'Airport Road, Srinagar', 34.0112000, 74.7709000, 'open', 18, 11, TRUE),
  (1, 'Fateh Kadal Covered Bay', 'Fateh Kadal, Srinagar', 34.0809000, 74.8107000, 'covered', 6, 2, TRUE),
  (1, 'HMT Industrial Open Lot', 'HMT, Srinagar', 34.1162000, 74.7663000, 'open', 25, 20, TRUE),
  (1, 'Bemina Basement Parking', 'Bemina, Srinagar', 34.1003000, 74.7675000, 'basement', 9, 6, TRUE),
  (1, 'Nigeen Road Secure Parking', 'Nigeen Road, Srinagar', 34.1084000, 74.8510000, 'covered', 11, 8, TRUE);
