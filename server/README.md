# Presence Server

Tracks and presents the presence status of a user, allowing them to embed
their current activity in to various interfaces. 

## API

### Set Presence

```
PUT /presence
```

Sets the presence. Requires that the shared secret be included in
the Authorization header:

```
Authorization: XYZSAMPLESECRET
```

### Get Presence

```
GET /presence
```

Gets the presence for the user, along with an associated metadata.

### Heartbeat

```
POST /heartbeat
```

Keeps the current presence alive. If the heartbeat is not sent for more
then 5 minutes, the presence is set to AWAY.
