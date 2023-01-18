TABLE "vehicle";
TABLE "brand";

-- ? ---------------------------------------------------- VEHICLE FUNCTIONS

CREATE OR REPLACE FUNCTION create_vehicle(json)
RETURNS VOID
LANGUAGE plpgsql AS 
$$
BEGIN
	IF(SELECT EXISTS(SELECT V.registration FROM "vehicle" as V  WHERE V."registration" = ($1->>'registration'))) = false THEN
		INSERT INTO "vehicle"("registration", "brand_id", "model")
		VALUES(
			($1->>'registration')::TEXT,
			($1->>'brand_id'):: INT,
			($1->>'model')
			);
		ELSE
		RAISE NOTICE 'Vehicle already exists';
	END IF;
END;
$$;

CREATE OR REPLACE FUNCTION vehicle_research(_model text)
	RETURNS TABLE (id int, reg text, model text)
	LANGUAGE plpgsql AS
$$
BEGIN 
RETURN QUERY 
	SELECT V.brand_id AS id, V.registration AS reg, V.model AS model_vehicle 
		FROM "vehicle" AS V
			WHERE V."model"= _model;
END;
$$;

DROP FUNCTION create_vehicle;
DROP FUNCTION vehicle_research;

SELECT create_vehicle('{"registration":"HG54JQW", "brand_id": 19, "model": "Clio RS"}');
SELECT vehicle_research('Mustang');

-- ? ---------------------------------------------------- USER FUNCTIONS
TABLE "user";

CREATE OR REPLACE FUNCTION create_user(json)
RETURNS VOID
LANGUAGE plpgsql AS
$$
BEGIN
	IF (SELECT EXISTS(SELECT U.email FROM "user" as U WHERE U."email" = ($1->>'email'))) = false THEN
			INSERT INTO "user"("email", "password", "last_name", "first_name", "is_admin")
			VALUES(
				($1 ->> 'email')::EMAIL, 
    			($1 ->> 'password')::TEXT,
    			($1 ->> 'last_name')::TEXT, 
    			($1 ->> 'first_name')::TEXT,
				($1 ->> 'is_admin')::BOOLEAN
				);
			ELSE
		RAISE NOTICE 'User already exist';
	END IF;
END;
$$;

CREATE OR REPLACE FUNCTION user_identity(_email text)
	RETURNS TABLE(id int,email EMAIL,password PASSWORD, last_name text, first_name text)
	LANGUAGE plpgsql AS
$$
BEGIN 
RETURN QUERY (SELECT U."id", U."email", U."password", U."last_name", U."first_name" FROM "user" AS U WHERE U."email" = _email);
END;
$$;


DROP FUNCTION user_identity;
DROP FUNCTION create_user;

SELECT user_identity('test@gtn.com');
SELECT * FROM check_and_create_user('{"email":"fredo@gtn.com", "password":"Test1234!", "last_name":"Basler", "first_name":"Fredo"}');


TABLE "location";

CREATE OR REPLACE FUNCTION find_location(_lat numeric, _lon numeric )
	RETURNS TABLE(id int, label text, address text, street_number int, zipcode postal_code_fr, city text, lat numeric, lon numeric )
	LANGUAGE plpgsql AS
$$
BEGIN 
RETURN QUERY (SELECT * FROM "location" AS L WHERE L."lat" = _lat AND L."lon" = _lon);
END;
$$;

CREATE OR REPLACE FUNCTION create_location(json)
RETURNS INT AS $$
BEGIN
			INSERT INTO "location"("label", "address", "street_number", "zipcode", "city", "lat", "lon")
			VALUES(
				($1 ->> 'label')::TEXT, 
    		($1 ->> 'address')::TEXT,
    		($1 ->> 'street_number')::INT, 
    		($1 ->> 'zipcode')::postal_code_fr,
				($1 ->> 'city')::TEXT,
				($1 ->> 'lat')::NUMERIC,
				($1 ->> 'lon')::NUMERIC
				)
				RETURN (SELECT L.id FROM "location" as L ORDER BY L.id DESC LIMIT 1);
END;
$$ LANGUAGE plpgsql;

-- TEST function create_location
SELECT * FROM create_location('{"label":"21 jump Street Manhanttan","address":"jump street","street_number":21, "zipcode": 93000, "city": "New York", "lat":40.001, "lon": 0.007, "user_id": 25}')

CREATE OR REPLACE FUNCTION update_location(json)
RETURNS INT
BEGIN
	UPDATE "location"
    	SET
          "label" = COALESCE(( $1 ->> 'label' )::TEXT, label),
          "address" = COALESCE(( $1 ->> 'address' )::TEXT, address),
          "street_number" = COALESCE(( $1 ->> 'street_number')::INTEGER, street_number),
          "zipcode" = COALESCE(( $1 ->> 'zipcode')::postal_code_fr, zipcode),
          "city" = COALESCE(( $1 ->> 'city' )::TEXT, city),
          "lat" = COALESCE (( $1 ->> 'lat' )::NUMERIC, lat),
          "lon" = COALESCE(($1 ->> 'lon')::NUMERIC, lon)
      WHERE "location"."id" = ($1 ->> 'id')::INT;
			RETURNING id;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION create_user_location(locationId INT, userId INT)
RETURNS VOID
LANGUAGE plpgsql AS
$$
BEGIN
	WITH deleted AS (DELETE FROM "user_has_location" WHERE user_id = userId RETURNING *)
	INSERT INTO "user_has_location"("location_id", "user_id")
	VALUES(locationId, userId);
END;
$$;

-- * TEST FUNCTION create_user_location --------------------------------------
SELECT * FROM create_user_location(50, 23);


--!---------------------------------------------------------------------------
--!---------------------------------------------------------------------------

-- Create update user location to update location_id in table user when insert a row in table user_has_location with a trigger 
CREATE OR REPLACE FUNCTION update_user_location()
	RETURNS TRIGGER AS $$
	BEGIN 
		IF (TG_OP = 'DELETE') THEN
			UPDATE "user" SET location_id = NULL WHERE location_id = OLD.location_id;
		    ELSE
        UPDATE "user" SET location_id = NEW.location_id WHERE "user".id = NEW.user_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER update_user_location_trigger
	AFTER DELETE OR INSERT ON user_has_location
	FOR EACH ROW
	EXECUTE FUNCTION update_user_location();

--!---------------------------------------------------------------------------
--!---------------------------------------------------------------------------

DROP TRIGGER  update_user_location_trigger ON "user_has_location";
DROP FUNCTION update_user_location();

-- Tests for trigger
TABLE "user";
TABLE "location";
TABLE "user_has_location";
TABLE "user_like_category";

INSERT INTO public."user_has_location"("location_id", "user_id")
	VALUES (13, 24);
	
	DELETE FROM public."user_has_location" WHERE "location_id" = 37;

-- DROP FUNCTION ------------------------------ // 
DROP FUNCTION find_location();
DROP FUNCTION create_location(json);
DROP FUNCTION create_user_location(int int);
DROP TRIGGER  update_user_location_trigger ON "user_has_location";
DROP FUNCTION update_user_location();