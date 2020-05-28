import React, { Fragment, useEffect } from "react";
import PropTypes from "prop-types";
import GroupActions from "./GroupActions";
import GroupRequest from "./GroupRequest";
import GroupMember from "./GroupMember";
import { connect } from "react-redux";
import { getproject } from "../../actions/project";
import { assignLeader } from "../../actions/group";
import { Select } from "@material-ui/core";
import { Row, Col } from "reactstrap";
const GroupMemb = ({
  getproject,
  project: { project },
  group: { group },
  auth: {
    user: { role },
  },
}) => {
  const ids=""
  const setValue=e=>{
ids=e;
  }
  useEffect(() => {
    getproject(group.project._id);
  }, [getproject, group.project._id]);
  return (
    <Fragment>
      <GroupActions group={group} />
      <h2 className="text-primary"> Teacher</h2>

      <p>
        <h4>
          {" "}
          <strong>Name:</strong>
          {project && project.projectOwner.name}{" "}
        </h4>
      </p>
      <h2 className="text-primary"> Requests</h2>
      {group.request.length > 0 ? (
        <Fragment>
        <Row>
          {group.request.map((req) => (
            <Col md={4}> 
             <GroupRequest key={req._id} request={req} groupId={group._id} />
           </Col>
          ))}
          </Row>
        </Fragment>
      ) : (
        <h4> No Request Found</h4>
      )}
      {role && role === "teacher" ? <Fragment>
      <h2 className="text-primary"> Assign team Leader</h2>
      <form className="form"
                onSubmit={
                    e => {
                        e.preventDefault();
                        assignLeader(group._id,ids);
                    }
            }>
        <Select options={group.members} onChange={(values) => setValue(values)} /> 
        </form></Fragment> : <Fragment />}
      <h2 className="text-primary"> Team Leader</h2>
      <h4>
        <strong>Name:</strong>
        {group.groupOwner.name}
      </h4>
      <h2 className="text-primary"> Members</h2>
      {group.members.length > 0 ? (
        <Fragment>
          {group.members.map((mem) => (
            <GroupMember key={mem._id} member={mem} />
          ))}
        </Fragment>
      ) : (
        <h4> No Member Found</h4>
      )}
    </Fragment>
  );
};

GroupMemb.propTypes = {
  group: PropTypes.object.isRequired,
  getproject: PropTypes.func.isRequired,
};
const mapStateToProps = (state) => ({
  group: state.group,
  auth: state.auth,
  project: state.project,
});

export default connect(mapStateToProps, { getproject })(GroupMemb);
