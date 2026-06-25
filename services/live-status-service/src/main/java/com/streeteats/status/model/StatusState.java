package com.streeteats.status.model;

public enum StatusState {
    OPEN,          // set up and serving right now
    MOVING,        // on the move / opening soon
    CLOSED,        // done for the day
    UNCONFIRMED    // nobody confirmed recently — auto-decayed, shown grey
}
