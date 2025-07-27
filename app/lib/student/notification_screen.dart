import 'package:career_nest/common/animated_appbar.dart';
import 'package:flutter/material.dart';
import '../common/responsive_text.dart';

class NotificationsPage extends StatefulWidget {
  const NotificationsPage({super.key});

  @override
  State<NotificationsPage> createState() => _NotificationsPageState();
}

class _NotificationsPageState extends State<NotificationsPage> {
  // Simple and safe notification data structure
  List<NotificationItem> notifications = [
    NotificationItem(
      title: 'Congratulations on completing the test!',
      time: 'Just now',
      type: 'achievement',
      isRead: false,
      icon: Icons.celebration,
      color: Colors.green,
    ),
    NotificationItem(
      title: 'Your course has been updated',
      time: 'Today',
      type: 'update',
      isRead: false,
      icon: Icons.update,
      color: Colors.blue,
    ),
    NotificationItem(
      title: 'You have a new message',
      time: '1 hour ago',
      type: 'message',
      isRead: true,
      icon: Icons.message,
      color: Colors.purple,
    ),
    NotificationItem(
      title: 'Reminder: Test deadline approaching',
      time: '2 hours ago',
      type: 'reminder',
      isRead: true,
      icon: Icons.schedule,
      color: Colors.orange,
    ),
    NotificationItem(
      title: 'New course available in Mathematics',
      time: 'Yesterday',
      type: 'course',
      isRead: true,
      icon: Icons.school,
      color: Colors.teal,
    ),
  ];

  void _markAsRead(int index) {
    setState(() {
      notifications[index].isRead = true;
    });
  }

  void _markAllAsRead() {
    setState(() {
      for (int i = 0; i < notifications.length; i++) {
        notifications[i].isRead = true;
      }
    });
  }

  int get unreadCount => notifications.where((n) => !n.isRead).length;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[50],
      appBar: AnimatedCurvedAppBar(
        title: "Notifications",
      ),
      body: notifications.isEmpty
          ? _buildEmptyState()
          : ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: notifications.length,
              itemBuilder: (context, index) {
                return NotificationCard(
                  notification: notifications[index],
                  onTap: () => _markAsRead(index),
                );
              },
            ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.notifications_off_outlined,
            size: 80,
            color: Colors.grey[400],
          ),
          const SizedBox(height: 16),
          AppText.subtitle(context, 'No notifications yet',
              color: Colors.grey[600]),
          const SizedBox(height: 8),
          AppText.bodyMedium(
              context, 'We\'ll notify you when something important happens',
              color: Colors.grey[500], textAlign: TextAlign.center),
        ],
      ),
    );
  }
}

// Simple notification data class
class NotificationItem {
  String title;
  String time;
  String type;
  bool isRead;
  IconData icon;
  Color color;

  NotificationItem({
    required this.title,
    required this.time,
    required this.type,
    required this.isRead,
    required this.icon,
    required this.color,
  });
}

// Clean and simple notification card
class NotificationCard extends StatelessWidget {
  final NotificationItem notification;
  final VoidCallback onTap;

  const NotificationCard({
    super.key,
    required this.notification,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: const Offset(0, 2),
          ),
        ],
        border: notification.isRead
            ? null
            : Border.all(
                color: notification.color.withOpacity(0.3),
                width: 2,
              ),
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(16),
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                // Notification icon
                Container(
                  width: 48,
                  height: 48,
                  decoration: BoxDecoration(
                    color: notification.color.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Icon(
                    notification.icon,
                    color: notification.color,
                    size: 24,
                  ),
                ),
                const SizedBox(width: 16),

                // Notification content
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Expanded(
                            child: Text(
                              notification.title,
                              style: TextStyle(
                                fontSize: 16,
                                fontWeight: notification.isRead
                                    ? FontWeight.w500
                                    : FontWeight.w600,
                                color: notification.isRead
                                    ? Colors.grey[700]
                                    : Colors.black87,
                              ),
                              maxLines: 2,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                          if (!notification.isRead)
                            Container(
                              width: 8,
                              height: 8,
                              decoration: BoxDecoration(
                                color: notification.color,
                                shape: BoxShape.circle,
                              ),
                            ),
                        ],
                      ),
                      const SizedBox(height: 4),
                      Row(
                        children: [
                          Icon(
                            Icons.access_time,
                            size: 14,
                            color: Colors.grey[500],
                          ),
                          const SizedBox(width: 4),
                          Text(
                            notification.time,
                            style: TextStyle(
                              fontSize: 12,
                              color: Colors.grey[500],
                              fontWeight: FontWeight.w400,
                            ),
                          ),
                          const Spacer(),
                          Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 8,
                              vertical: 2,
                            ),
                            decoration: BoxDecoration(
                              color: notification.color.withOpacity(0.1),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Text(
                              notification.type.toUpperCase(),
                              style: TextStyle(
                                fontSize: 10,
                                fontWeight: FontWeight.w600,
                                color: notification.color,
                                letterSpacing: 0.5,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
