import React, { useMemo } from 'react';
import { useTasks } from '../context/TaskContext';
import { useTheme } from '../context/ThemeContext';
import { BarChart3, TrendingUp, CheckCircle, Clock, AlertCircle, Calendar, Target, Award } from 'lucide-react';

const AnalyticsDashboard = () => {
  const { allTasks } = useTasks();
  const { isDarkMode, theme } = useTheme();

  const analytics = useMemo(() => {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Basic stats
    const totalTasks = allTasks.length;
    const completedTasks = allTasks.filter(task => task.status === 'completed').length;
    const inProgressTasks = allTasks.filter(task => task.status === 'in-progress').length;
    const pendingTasks = allTasks.filter(task => task.status === 'pending').length;

    // Overdue tasks
    const overdueTasks = allTasks.filter(task => 
      task.dueDate && 
      new Date(task.dueDate) < now && 
      task.status !== 'completed'
    ).length;

    // Completion rate
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks * 100).toFixed(1) : 0;

    // Recent activity (last 7 days)
    const recentTasks = allTasks.filter(task => 
      new Date(task.createdAt) >= sevenDaysAgo
    );
    const recentCompletions = allTasks.filter(task => 
      task.completedAt && new Date(task.completedAt) >= sevenDaysAgo
    );

    // Priority distribution
    const priorityStats = {
      high: allTasks.filter(task => task.priority === 'high').length,
      medium: allTasks.filter(task => task.priority === 'medium').length,
      low: allTasks.filter(task => task.priority === 'low').length
    };

    // Monthly trend (last 30 days)
    const monthlyCreated = allTasks.filter(task => 
      new Date(task.createdAt) >= thirtyDaysAgo
    ).length;
    const monthlyCompleted = allTasks.filter(task => 
      task.completedAt && new Date(task.completedAt) >= thirtyDaysAgo
    ).length;

    // Average completion time
    const completedWithTime = allTasks.filter(task => 
      task.status === 'completed' && task.completedAt
    );
    const avgCompletionTime = completedWithTime.length > 0 
      ? completedWithTime.reduce((sum, task) => {
          const created = new Date(task.createdAt);
          const completed = new Date(task.completedAt);
          return sum + (completed - created);
        }, 0) / completedWithTime.length
      : 0;

    const avgDays = Math.round(avgCompletionTime / (1000 * 60 * 60 * 24));

    // Productivity score (combination of completion rate and recent activity)
    const productivityScore = Math.min(100, Math.round(
      (completionRate * 0.6) + 
      (recentCompletions.length * 10) + 
      (overdueTasks === 0 ? 20 : Math.max(0, 20 - overdueTasks * 5))
    ));

    return {
      totalTasks,
      completedTasks,
      inProgressTasks,
      pendingTasks,
      overdueTasks,
      completionRate,
      recentTasks: recentTasks.length,
      recentCompletions: recentCompletions.length,
      priorityStats,
      monthlyCreated,
      monthlyCompleted,
      avgDays,
      productivityScore
    };
  }, [allTasks]);

  const StatCard = ({ icon: Icon, title, value, subtitle, color, trend }) => (
    <div style={{
      backgroundColor: isDarkMode ? theme.surface : 'white',
      border: `1px solid ${isDarkMode ? theme.border : '#e9ecef'}`,
      borderRadius: '12px',
      padding: '20px',
      boxShadow: isDarkMode 
        ? '0 4px 6px rgba(0, 0, 0, 0.3)' 
        : '0 2px 4px rgba(0, 0, 0, 0.1)',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      cursor: 'pointer'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.boxShadow = isDarkMode 
        ? '0 8px 15px rgba(0, 0, 0, 0.4)' 
        : '0 6px 20px rgba(0, 0, 0, 0.15)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = isDarkMode 
        ? '0 4px 6px rgba(0, 0, 0, 0.3)' 
        : '0 2px 4px rgba(0, 0, 0, 0.1)';
    }}
    >
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '12px'
      }}>
        <div style={{
          backgroundColor: `${color}20`,
          color: color,
          padding: '8px',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center'
        }}>
          <Icon size={20} />
        </div>
        {trend && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '12px',
            color: trend > 0 ? '#28a745' : '#dc3545',
            fontWeight: '500'
          }}>
            <TrendingUp size={12} style={{
              transform: trend < 0 ? 'rotate(180deg)' : 'none'
            }} />
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div>
        <h3 style={{
          margin: '0 0 4px 0',
          fontSize: '28px',
          fontWeight: '700',
          color: isDarkMode ? theme.text : '#2d3748'
        }}>
          {value}
        </h3>
        <p style={{
          margin: 0,
          fontSize: '14px',
          fontWeight: '600',
          color: isDarkMode ? theme.text : '#4a5568'
        }}>
          {title}
        </p>
        {subtitle && (
          <p style={{
            margin: '4px 0 0 0',
            fontSize: '12px',
            color: isDarkMode ? theme.textMuted : '#6c757d'
          }}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );

  const ProgressBar = ({ label, value, max, color }) => (
    <div style={{ marginBottom: '16px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '6px'
      }}>
        <span style={{
          fontSize: '14px',
          fontWeight: '500',
          color: isDarkMode ? theme.text : '#4a5568'
        }}>
          {label}
        </span>
        <span style={{
          fontSize: '12px',
          color: isDarkMode ? theme.textMuted : '#6c757d'
        }}>
          {value} / {max}
        </span>
      </div>
      <div style={{
        width: '100%',
        height: '8px',
        backgroundColor: isDarkMode ? '#404040' : '#e9ecef',
        borderRadius: '4px',
        overflow: 'hidden'
      }}>
        <div style={{
          width: `${max > 0 ? (value / max) * 100 : 0}%`,
          height: '100%',
          backgroundColor: color,
          borderRadius: '4px',
          transition: 'width 0.3s ease'
        }} />
      </div>
    </div>
  );

  return (
    <div style={{
      backgroundColor: isDarkMode ? theme.background : '#f8f9fa',
      borderRadius: '12px',
      padding: '20px',
      minHeight: 'calc(100vh - 200px)'
    }}>
      {/* Header */}
      <div style={{
        marginBottom: '24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h2 style={{
            margin: '0 0 4px 0',
            fontSize: '24px',
            fontWeight: '600',
            color: isDarkMode ? theme.text : '#2d3748'
          }}>
            Analytics Dashboard
          </h2>
          <p style={{
            margin: 0,
            fontSize: '14px',
            color: isDarkMode ? theme.textMuted : '#6c757d'
          }}>
            Track your productivity and task management insights
          </p>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: isDarkMode ? theme.surface : 'white',
          padding: '8px 12px',
          borderRadius: '8px',
          border: `1px solid ${isDarkMode ? theme.border : '#e9ecef'}`
        }}>
          <Award size={16} style={{ color: '#ffc107' }} />
          <span style={{
            fontSize: '14px',
            fontWeight: '600',
            color: isDarkMode ? theme.text : '#2d3748'
          }}>
            Productivity Score: {analytics.productivityScore}/100
          </span>
        </div>
      </div>

      {/* Key Metrics */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '32px'
      }}>
        <StatCard
          icon={Target}
          title="Total Tasks"
          value={analytics.totalTasks}
          subtitle="All time"
          color="#007bff"
        />
        <StatCard
          icon={CheckCircle}
          title="Completed"
          value={analytics.completedTasks}
          subtitle={`${analytics.completionRate}% completion rate`}
          color="#28a745"
        />
        <StatCard
          icon={Clock}
          title="In Progress"
          value={analytics.inProgressTasks}
          subtitle="Currently active"
          color="#007bff"
        />
        <StatCard
          icon={AlertCircle}
          title="Overdue"
          value={analytics.overdueTasks}
          subtitle="Need attention"
          color="#dc3545"
        />
      </div>

      {/* Detailed Analytics */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px'
      }}>
        {/* Recent Activity */}
        <div style={{
          backgroundColor: isDarkMode ? theme.surface : 'white',
          border: `1px solid ${isDarkMode ? theme.border : '#e9ecef'}`,
          borderRadius: '12px',
          padding: '20px'
        }}>
          <h3 style={{
            margin: '0 0 16px 0',
            fontSize: '18px',
            fontWeight: '600',
            color: isDarkMode ? theme.text : '#2d3748',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <BarChart3 size={20} style={{ color: '#007bff' }} />
            Recent Activity (7 days)
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px',
            marginBottom: '20px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#007bff',
                marginBottom: '4px'
              }}>
                {analytics.recentTasks}
              </div>
              <div style={{
                fontSize: '12px',
                color: isDarkMode ? theme.textMuted : '#6c757d'
              }}>
                Tasks Created
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#28a745',
                marginBottom: '4px'
              }}>
                {analytics.recentCompletions}
              </div>
              <div style={{
                fontSize: '12px',
                color: isDarkMode ? theme.textMuted : '#6c757d'
              }}>
                Tasks Completed
              </div>
            </div>
          </div>
          <div style={{
            fontSize: '12px',
            color: isDarkMode ? theme.textMuted : '#6c757d',
            textAlign: 'center',
            padding: '12px',
            backgroundColor: isDarkMode ? '#404040' : '#f8f9fa',
            borderRadius: '6px'
          }}>
            Average completion time: {analytics.avgDays} days
          </div>
        </div>

        {/* Priority Distribution */}
        <div style={{
          backgroundColor: isDarkMode ? theme.surface : 'white',
          border: `1px solid ${isDarkMode ? theme.border : '#e9ecef'}`,
          borderRadius: '12px',
          padding: '20px'
        }}>
          <h3 style={{
            margin: '0 0 20px 0',
            fontSize: '18px',
            fontWeight: '600',
            color: isDarkMode ? theme.text : '#2d3748',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertCircle size={20} style={{ color: '#ffc107' }} />
            Priority Distribution
          </h3>
          <ProgressBar
            label="High Priority"
            value={analytics.priorityStats.high}
            max={analytics.totalTasks}
            color="#dc3545"
          />
          <ProgressBar
            label="Medium Priority"
            value={analytics.priorityStats.medium}
            max={analytics.totalTasks}
            color="#ffc107"
          />
          <ProgressBar
            label="Low Priority"
            value={analytics.priorityStats.low}
            max={analytics.totalTasks}
            color="#28a745"
          />
        </div>

        {/* Monthly Trends */}
        <div style={{
          backgroundColor: isDarkMode ? theme.surface : 'white',
          border: `1px solid ${isDarkMode ? theme.border : '#e9ecef'}`,
          borderRadius: '12px',
          padding: '20px'
        }}>
          <h3 style={{
            margin: '0 0 16px 0',
            fontSize: '18px',
            fontWeight: '600',
            color: isDarkMode ? theme.text : '#2d3748',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Calendar size={20} style={{ color: '#17a2b8' }} />
            Monthly Trends (30 days)
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px'
          }}>
            <div style={{
              textAlign: 'center',
              padding: '16px',
              backgroundColor: isDarkMode ? '#404040' : '#f8f9fa',
              borderRadius: '8px'
            }}>
              <div style={{
                fontSize: '20px',
                fontWeight: '700',
                color: '#007bff',
                marginBottom: '4px'
              }}>
                {analytics.monthlyCreated}
              </div>
              <div style={{
                fontSize: '12px',
                color: isDarkMode ? theme.textMuted : '#6c757d'
              }}>
                Created
              </div>
            </div>
            <div style={{
              textAlign: 'center',
              padding: '16px',
              backgroundColor: isDarkMode ? '#404040' : '#f8f9fa',
              borderRadius: '8px'
            }}>
              <div style={{
                fontSize: '20px',
                fontWeight: '700',
                color: '#28a745',
                marginBottom: '4px'
              }}>
                {analytics.monthlyCompleted}
              </div>
              <div style={{
                fontSize: '12px',
                color: isDarkMode ? theme.textMuted : '#6c757d'
              }}>
                Completed
              </div>
            </div>
          </div>
        </div>

        {/* Productivity Insights */}
        <div style={{
          backgroundColor: isDarkMode ? theme.surface : 'white',
          border: `1px solid ${isDarkMode ? theme.border : '#e9ecef'}`,
          borderRadius: '12px',
          padding: '20px'
        }}>
          <h3 style={{
            margin: '0 0 16px 0',
            fontSize: '18px',
            fontWeight: '600',
            color: isDarkMode ? theme.text : '#2d3748',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <TrendingUp size={20} style={{ color: '#28a745' }} />
            Productivity Insights
          </h3>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <div style={{
              padding: '12px',
              backgroundColor: analytics.completionRate >= 80 
                ? (isDarkMode ? '#1e5631' : '#d4edda') 
                : analytics.completionRate >= 60 
                  ? (isDarkMode ? '#856404' : '#fff3cd')
                  : (isDarkMode ? '#721c24' : '#f8d7da'),
              borderRadius: '6px',
              fontSize: '12px',
              color: analytics.completionRate >= 80 
                ? '#28a745' 
                : analytics.completionRate >= 60 
                  ? '#856404'
                  : '#721c24'
            }}>
              {analytics.completionRate >= 80 
                ? '🎉 Excellent completion rate! Keep up the great work!'
                : analytics.completionRate >= 60 
                  ? '👍 Good progress! Try to complete more pending tasks.'
                  : '📈 Focus on completing existing tasks before creating new ones.'}
            </div>
            <div style={{
              padding: '12px',
              backgroundColor: analytics.overdueTasks === 0 
                ? (isDarkMode ? '#1e5631' : '#d4edda')
                : (isDarkMode ? '#721c24' : '#f8d7da'),
              borderRadius: '6px',
              fontSize: '12px',
              color: analytics.overdueTasks === 0 ? '#28a745' : '#721c24'
            }}>
              {analytics.overdueTasks === 0 
                ? '✅ No overdue tasks! Great time management!'
                : `⚠️ ${analytics.overdueTasks} overdue task${analytics.overdueTasks > 1 ? 's' : ''}. Consider reviewing your deadlines.`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;