import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './FileAttachments.css';

const FileAttachments = ({ taskId }) => {
  const [attachments, setAttachments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    if (taskId) {
      fetchAttachments();
    }
  }, [taskId]);

  const fetchAttachments = async () => {
    try {
      const response = await axios.get(`/api/attachments/task/${taskId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setAttachments(response.data);
    } catch (error) {
      console.error('Failed to fetch attachments:', error);
    }
  };

  const handleFileSelect = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      await axios.post(`/api/attachments/${taskId}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setSelectedFile(null);
      fetchAttachments();
    } catch (error) {
      console.error('Failed to upload file:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (attachmentId) => {
    try {
      await axios.delete(`/api/attachments/${attachmentId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchAttachments();
    } catch (error) {
      console.error('Failed to delete attachment:', error);
    }
  };

  const getFileIcon = (fileType) => {
    const icons = {
      document: '📄',
      image: '🖼️',
      video: '🎥',
      audio: '🔊',
      other: '📎'
    };
    return icons[fileType] || '📎';
  };

  return (
    <div className="file-attachments">
      <h3>Attachments</h3>

      <div className="upload-section">
        <form onSubmit={handleUpload}>
          <input
            type="file"
            onChange={handleFileSelect}
            accept="*/*"
          />
          <button
            type="submit"
            disabled={!selectedFile || uploading}
            className="btn btn-primary"
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </form>
      </div>

      <div className="attachments-list">
        {attachments.length === 0 ? (
          <p className="no-attachments">No attachments yet</p>
        ) : (
          attachments.map((attachment) => (
            <div key={attachment._id} className="attachment-item">
              <span className="file-icon">{getFileIcon(attachment.fileType)}</span>
              <div className="file-info">
                <a href={attachment.url} target="_blank" rel="noopener noreferrer">
                  {attachment.originalName}
                </a>
                <small>{(attachment.fileSize / 1024).toFixed(2)} KB</small>
              </div>
              <button
                className="btn btn-sm btn-danger"
                onClick={() => handleDelete(attachment._id)}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FileAttachments;
