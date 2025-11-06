import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { TaskContext } from '../context/TaskContext';
import './TeamManagement.css';

const TeamManagement = () => {
  const [teams, setTeams] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    memberEmail: '',
    memberRole: 'member'
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await axios.get('/api/teams/user/teams', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setTeams(response.data);
    } catch (error) {
      console.error('Failed to fetch teams:', error);
    }
  };

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(
        '/api/teams',
        {
          name: formData.name,
          description: formData.description
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );

      setFormData({ ...formData, name: '', description: '' });
      setShowCreateModal(false);
      fetchTeams();
    } catch (error) {
      console.error('Failed to create team:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInviteMember = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(
        `/api/teams/${selectedTeam._id}/invite`,
        {
          email: formData.memberEmail,
          role: formData.memberRole
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );

      setFormData({ ...formData, memberEmail: '' });
      setShowInviteModal(false);
      fetchTeams();
    } catch (error) {
      console.error('Failed to invite member:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTeam = async (teamId) => {
    if (window.confirm('Are you sure you want to delete this team?')) {
      try {
        await axios.delete(`/api/teams/${teamId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        fetchTeams();
      } catch (error) {
        console.error('Failed to delete team:', error);
      }
    }
  };

  return (
    <div className="team-management">
      <div className="team-header">
        <h2>Team Management</h2>
        <button
          className="btn btn-primary"
          onClick={() => setShowCreateModal(true)}
        >
          + New Team
        </button>
      </div>

      <div className="teams-grid">
        {teams.map((team) => (
          <div key={team._id} className="team-card">
            <div className="team-card-header">
              <h3>{team.name}</h3>
              <span className="team-role">{team.owner._id === localStorage.getItem('userId') ? 'Owner' : 'Member'}</span>
            </div>
            <p className="team-description">{team.description}</p>

            <div className="team-members">
              <strong>Members ({team.members.length})</strong>
              <ul>
                {team.members.map((member) => (
                  <li key={member.userId._id}>
                    {member.userId.name} - {member.role}
                  </li>
                ))}
              </ul>
            </div>

            <div className="team-actions">
              {team.owner._id === localStorage.getItem('userId') && (
                <>
                  <button
                    className="btn btn-sm btn-secondary"
                    onClick={() => {
                      setSelectedTeam(team);
                      setShowInviteModal(true);
                    }}
                  >
                    Invite
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDeleteTeam(team._id)}
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {showCreateModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Create Team</h2>
            <form onSubmit={handleCreateTeam}>
              <input
                type="text"
                placeholder="Team Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <textarea
                placeholder="Team Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
              <div className="form-actions">
                <button type="submit" disabled={loading} className="btn btn-primary">
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showInviteModal && selectedTeam && (
        <div className="modal">
          <div className="modal-content">
            <h2>Invite Member to {selectedTeam.name}</h2>
            <form onSubmit={handleInviteMember}>
              <input
                type="email"
                placeholder="Member Email"
                value={formData.memberEmail}
                onChange={(e) => setFormData({ ...formData, memberEmail: e.target.value })}
                required
              />
              <select
                value={formData.memberRole}
                onChange={(e) => setFormData({ ...formData, memberRole: e.target.value })}
              >
                <option value="viewer">Viewer</option>
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </select>
              <div className="form-actions">
                <button type="submit" disabled={loading} className="btn btn-primary">
                  Send Invite
                </button>
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamManagement;
