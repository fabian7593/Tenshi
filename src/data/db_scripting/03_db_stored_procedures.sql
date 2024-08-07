DROP PROCEDURE IF EXISTS GetUserNotifications;

DELIMITER //

CREATE PROCEDURE GetUserNotifications(
    IN pSenderEmail VARCHAR(250),
    IN pReceiverEmail VARCHAR(250),
    IN pPageSize INT,
    IN pPageNumber INT
)
BEGIN
    DECLARE pOffset INT DEFAULT 0;
    DECLARE pLimit INT;
    
    IF (pPageSize IS NOT NULL AND pPageSize <> 0) AND (pPageNumber IS NOT NULL AND pPageNumber <> 0) THEN
        SET pOffset = (pPageNumber - 1) * pPageSize;
        SET pLimit = pPageSize;
    ELSE
        SET pLimit = 50000; -- Límite grande si no se especifica la paginación
    END IF;

    SELECT
        un.id,
        un.created_date AS notification_date,
        un.is_read,
        n.code AS notification_code,
        n.subject AS notification_subject,
        n.message AS notification_message,
        n.required_send_email,
        n.action_url,
        s.id AS sender_id,
        s.email AS sender_email,
        r.id AS receiver_id,
        r.email AS receiver_email
    FROM
        user_notifications un
    INNER JOIN
        notifications n ON un.notification_code = n.code
    LEFT OUTER JOIN
        users s ON un.id_user_send = s.id
    INNER JOIN
        users r ON un.id_user_receive = r.id
    WHERE
        un.is_deleted = 0
        AND (COALESCE(pSenderEmail, '') = '' OR s.email = pSenderEmail)
        AND (COALESCE(pReceiverEmail, '') = '' OR r.email = pReceiverEmail)
    LIMIT pLimit
    OFFSET pOffset;
END //

DELIMITER ;








DROP PROCEDURE IF EXISTS GetLogsWithFilters;
DELIMITER //

CREATE PROCEDURE GetLogsWithFilters(
    IN pEnvironment VARCHAR(200),
    IN pUserId VARCHAR(200),
    IN pType VARCHAR(40),
    IN pPageSize INT,
    IN pPageNumber INT
)
BEGIN
    DECLARE pOffset INT DEFAULT 0;
    DECLARE pLimit INT;
    
    IF (pPageSize IS NOT NULL AND pPageSize <> 0) AND (pPageNumber IS NOT NULL AND pPageNumber <> 0) THEN
        SET pOffset = (pPageNumber - 1) * pPageSize;
        SET pLimit = pPageSize;
    ELSE
        SET pLimit = 50000; -- Límite grande si no se especifica la paginación
    END IF;

    SELECT
        id,
        method,
        class,
        type,
        https,
        message,
        description,
        created_date,
        user_id,
        environment
    FROM
        logs
    WHERE
        (COALESCE(pEnvironment, '') = '' OR environment = pEnvironment)
        AND (COALESCE(pUserId, '') = '' OR user_id = pUserId)
        AND (COALESCE(pType, '') = '' OR type = pType)
    LIMIT pLimit
    OFFSET pOffset;
END //
DELIMITER ;
