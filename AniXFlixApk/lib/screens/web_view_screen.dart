import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';
import 'package:flutter/foundation.dart';
import 'package:connectivity_plus/connectivity_plus.dart';
import 'dart:async';
import 'package:flutter/services.dart';
import 'offline_screen.dart';

class WebViewScreen extends StatefulWidget {
  const WebViewScreen({super.key});

  @override
  State<WebViewScreen> createState() => _WebViewScreenState();
}

class _WebViewScreenState extends State<WebViewScreen> {
  late final WebViewController _controller;
  bool _isLoading = true;
  bool _isOffline = false;
  late StreamSubscription<List<ConnectivityResult>> _connectivitySubscription;

  @override
  void initState() {
    super.initState();
    _checkInitialConnectivity();
    _setupConnectivityListener();
    _initWebView();
  }

  Future<void> _checkInitialConnectivity() async {
    final result = await Connectivity().checkConnectivity();
    _updateOfflineState(result);
  }

  void _setupConnectivityListener() {
    _connectivitySubscription = Connectivity().onConnectivityChanged.listen((List<ConnectivityResult> result) {
      _updateOfflineState(result);
    });
  }

  void _updateOfflineState(List<ConnectivityResult> result) {
    bool isNowOffline = result.isEmpty || result.contains(ConnectivityResult.none);
    
    if (isNowOffline && !_isOffline) {
      setState(() { _isOffline = true; });
    } else if (!isNowOffline && _isOffline) {
      setState(() { _isOffline = false; });
      _controller.reload();
    }
  }

  void _initWebView() {
    _controller = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..setBackgroundColor(const Color(0xFF000000))
      ..setNavigationDelegate(
        NavigationDelegate(
          onPageStarted: (String url) {
            setState(() { _isLoading = true; });
          },
          onPageFinished: (String url) {
            setState(() { _isLoading = false; });
            _injectCSSAndJS();
          },
          onNavigationRequest: (NavigationRequest request) {
            final url = request.url.toLowerCase();
            
            // 1. Allow our own domain
            if (url.startsWith('https://anixflix') || url.contains('vercel.app')) {
              return NavigationDecision.navigate;
            }
            
            // 2. Allow known video embed providers
            final allowedProviders = [
              'vidsrc', 'vidlink', 'vidify', 'vidzee', '2embed', 
              'vidking', 'videasy', 'peachify', 'vidfast', 
              'primesrc', 'vidrock', 'hnembed', 'youtube', 'vimeo'
            ];
            
            for (final provider in allowedProviders) {
              if (url.contains(provider)) {
                return NavigationDecision.navigate;
              }
            }
            
            // 3. Allow TMDB image loading
            if (url.contains('tmdb.org')) {
              return NavigationDecision.navigate;
            }
            
            // 4. Block EVERYTHING ELSE (This kills all pop-ups, redirects, and ad tabs)
            debugPrint('BLOCKED AD/POPUP: $url');
            return NavigationDecision.prevent;
          },
        ),
      )
      ..loadRequest(Uri.parse('https://anixflix-iota.vercel.app/'));
  }

  void _injectCSSAndJS() {
    // Disable zoom, text selection, and context menus to make the web app feel like a native app
    const String script = """
      // Inject Android app class to let the website disable heavy CSS
      document.documentElement.classList.add('android-apk');
      
      // Disable text selection
      document.body.style.userSelect = 'none';
      document.body.style.webkitUserSelect = 'none';
      document.body.style.msUserSelect = 'none';
      document.body.style.mozUserSelect = 'none';
      
      // Disable callout (context menu) on iOS/Android
      document.body.style.webkitTouchCallout = 'none';
      
      // Disable long press context menus globally
      document.oncontextmenu = function(e) { e.preventDefault(); return false; };
      
      // Disable zooming via meta tag
      var meta = document.createElement('meta');
      meta.name = 'viewport';
      meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
      document.getElementsByTagName('head')[0].appendChild(meta);
    """;
    _controller.runJavaScript(script);
  }

  @override
  void dispose() {
    _connectivitySubscription.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (_isOffline) {
      return OfflineScreen(
        onRetry: () async {
          await _checkInitialConnectivity();
        },
      );
    }

    return PopScope(
      canPop: false,
      onPopInvoked: (didPop) async {
        if (didPop) return;
        if (await _controller.canGoBack()) {
          await _controller.goBack();
        } else {
          SystemNavigator.pop();
        }
      },
      child: Scaffold(
      resizeToAvoidBottomInset: false,
      backgroundColor: Colors.black,
      body: Stack(
        children: [
          SafeArea(
            bottom: false,
            child: WebViewWidget(controller: _controller),
          ),
          if (_isLoading)
            const Center(
              child: CircularProgressIndicator(
                color: Color(0xFFE50914), // Netflix red loader
              ),
            ),
        ],
      ),
    ));
  }
}
