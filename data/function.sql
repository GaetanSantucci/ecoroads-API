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
			INSERT INTO "user"("email", "password", "last_name", "first_name")
			VALUES(
				($1 ->> 'email')::EMAIL, 
    			($1 ->> 'password')::TEXT,
    			($1 ->> 'last_name')::TEXT, 
    			($1 ->> 'first_name')::TEXT
				);
			ELSE
		RAISE NOTICE 'User already exist';
	END IF;
END;
$$;

DROP FUNCTION create_user;

SELECT * FROM check_and_create_user('{"email":"fredo@gtn.com", "password":"Test1234!", "last_name":"Basler", "first_name":"Fredo"}');
