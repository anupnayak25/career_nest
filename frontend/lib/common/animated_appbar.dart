import 'package:flutter/material.dart';

class AnimatedCurvedAppBar extends StatefulWidget implements PreferredSizeWidget {
  final String title;
  final TabController? tabController; // Nullable

  const AnimatedCurvedAppBar({
    super.key,
    required this.title,
    this.tabController,
  });

  @override
  State<AnimatedCurvedAppBar> createState() => _AnimatedCurvedAppBarState();

 @override
Size get preferredSize => Size.fromHeight(tabController != null ? 120 : kToolbarHeight + 12);

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
      child: ClipRRect(
        borderRadius: const BorderRadius.only(
          bottomLeft: Radius.circular(24),
          bottomRight: Radius.circular(24),
        ),
        child: AppBar(
          title: Text(widget.title, style: const TextStyle(color: Colors.white)),
          automaticallyImplyLeading: false,
          backgroundColor: Colors.blue,
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
    );
  }
}
