import React from 'react';
import { StreamApp, NotificationDropdown, FlatFeed, LikeButton, Activity, CommentList, CommentField, StatusUpdateForm } from 'react-activity-feed';
import 'react-activity-feed/dist/index.css';

class Posts extends React.Component {
  constructor(props){
    super(props);
    this.state = {
     // userName: this.props.userName,
      groupID: this.props.groupID
    }
  }
  render () {
    return (
      <StreamApp
        apiKey="3mqcuj9e49f2"
        appId="77254"
        token="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoidXNlci1vbmUifQ.cN-PQrIelL2a6PPnBxN3ZxpfBgMg9BYfrQMUYbFoTPo"
      >
        <NotificationDropdown notify />
        <StatusUpdateForm
          feedGroup="teamX"
          userId="frank" />
        <FlatFeed
          options={ {reactions: { recent: true } } }
          notify
          Activity={(props) =>
              <Activity {...props}
                Footer={() => (
                  <div style={ {padding: '8px 16px'} }>
                    <LikeButton {...props} />
                    <CommentField
                      activity={props.activity}
                      onAddReaction={props.onAddReaction} />
                    <CommentList activityId={props.activity.id} />
                  </div>
                )}
              />
            }
          />
      </StreamApp>
    );
  }
}

export default Posts;