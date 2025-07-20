import 'package:flutter/material.dart';

class AnimatedCurvedAppBar extends StatefulWidget implements PreferredSizeWidget {
  final String title;
  final TabController? tabController;

  const AnimatedCurvedAppBar({
    super.key,
    required this.title,
    this.tabController,
  });

  // ✅ Implement preferredSize here — in the widget class
  @override
  Size get preferredSize =>
      Size.fromHeight(tabController != null ? 120 : kToolbarHeight + 12);

  @override
  State<AnimatedCurvedAppBar> createState() => _AnimatedCurvedAppBarState();
}

class _AnimatedCurvedAppBarState extends State<AnimatedCurvedAppBar>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<Offset> _slideAnimation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 600),
    );

    _slideAnimation = Tween<Offset>(
      begin: const Offset(0, -1),
      end: Offset.zero,
    ).animate(CurvedAnimation(
      parent: _controller,
      curve: Curves.easeOut,
    ));

    _controller.forward();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return SlideTransition(
      position: _slideAnimation,
      child: Material(
        color: Colors.transparent,
        child: ClipRRect(
          borderRadius: const BorderRadius.only(
            bottomLeft: Radius.circular(30),
            bottomRight: Radius.circular(30),
          ),
          child: AppBar(
            title: Text(
              widget.title,
              style: const TextStyle(color: Colors.white),
            ),
            automaticallyImplyLeading: false,
            backgroundColor: Colors.blue,
            elevation: 0,
            bottom: widget.tabController != null
                ? TabBar(
                    controller: widget.tabController!,
                    indicatorColor: Colors.white,
                    labelColor: Colors.white,
                    unselectedLabelColor: Colors.white70,
                    tabs: const [
                      Tab(text: 'Events'),
                      Tab(text: 'Placements'),
                    ],
                  )
                : null,
          ),
        ),
      ),
    );
  }
}
