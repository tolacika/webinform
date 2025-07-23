import 'dart:async';
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

const String apiBaseUrl = 'http://192.168.1.76:3000/api';

void main() {
  runApp(const MyApp());
}

class Subscriber {
  final String name;
  final String email;
  Subscriber({required this.name, required this.email});
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Newsletter Subscription',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
      ),
      home: const NewsletterPage(),
    );
  }
}

class NewsletterPage extends StatefulWidget {
  const NewsletterPage({super.key});
  @override
  State<NewsletterPage> createState() => _NewsletterPageState();
}

class _NewsletterPageState extends State<NewsletterPage> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  bool _isSubmitting = false;
  String? _submitMessage;
  int _subscriberCount = 0;
  Subscriber? _latestSubscriber;
  Timer? _timer;

  @override
  void initState() {
    super.initState();
    _fetchStats();
    _timer = Timer.periodic(const Duration(seconds: 5), (_) => _fetchStats());
  }

  @override
  void dispose() {
    _timer?.cancel();
    _nameController.dispose();
    _emailController.dispose();
    super.dispose();
  }

  Future<void> _fetchStats() async {
    try {
      final countRes = await http.get(Uri.parse('$apiBaseUrl/count'));
      final recentRes = await http.get(Uri.parse('$apiBaseUrl/recent'));
      if (countRes.statusCode == 200) {
        setState(() {
          _subscriberCount = json.decode(countRes.body)['count'] ?? 0;
        });
      }
      if (recentRes.statusCode == 200) {
        final recent = json.decode(recentRes.body)['recent_subscribers'];
        if (recent != null && recent.isNotEmpty) {
          setState(() {
            _latestSubscriber = Subscriber(
              name: recent[0]['name'],
              email: recent[0]['email'],
            );
          });
        }
      }
    } catch (_) {
      // Handle error silently or show a message
    }
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() {
      _isSubmitting = true;
      _submitMessage = null;
    });
    final res = await http.post(
      Uri.parse('$apiBaseUrl/subscribe'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode({
        'name': _nameController.text,
        'email': _emailController.text,
      }),
    );
    setState(() {
      _isSubmitting = false;
      if (res.statusCode == 201) {
        _submitMessage = 'Sikeres feliratkozás!';
        _nameController.clear();
        _emailController.clear();
        _fetchStats();
      } else {
        final err = json.decode(res.body);
        _submitMessage = err['errors']['email'] ?? 'Hiba történt!';
      }
    });
  }

  String? _validateName(String? value) {
    if (value == null || value.trim().length < 5 || value.trim().length > 40) {
      return 'Név 5-40 karakter legyen';
    }
    return null;
  }

  String? _validateEmail(String? value) {
    if (value == null ||
        !RegExp(r'^[^@]+@[^@]+\.[^@]+').hasMatch(value.trim())) {
      return 'Valós email címet adj meg';
    }
    return null;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Hírlevél feliratkozás'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            Form(
              key: _formKey,
              child: Column(
                children: [
                  TextFormField(
                    controller: _nameController,
                    decoration: const InputDecoration(labelText: 'Név'),
                    validator: _validateName,
                  ),
                  TextFormField(
                    controller: _emailController,
                    decoration: const InputDecoration(labelText: 'Email'),
                    validator: _validateEmail,
                  ),
                  const SizedBox(height: 16),
                  ElevatedButton(
                    onPressed: _isSubmitting ? null : _submit,
                    child: _isSubmitting
                        ? const CircularProgressIndicator()
                        : const Text('Feliratkozás'),
                  ),
                  if (_submitMessage != null)
                    Padding(
                      padding: const EdgeInsets.all(8.0),
                      child: Text(
                        _submitMessage!,
                        style: TextStyle(
                          color: _submitMessage == 'Sikeres feliratkozás!'
                              ? Colors.green
                              : Colors.red,
                        ),
                      ),
                    ),
                ],
              ),
            ),
            const SizedBox(height: 32),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  children: [
                    Text('Feliratkozók száma: $_subscriberCount',
                        style: Theme.of(context).textTheme.titleMedium),
                    const SizedBox(height: 8),
                    if (_latestSubscriber != null)
                      Column(
                        children: [
                          Text('Utolsó feliratkozó:'),
                          Text(_latestSubscriber!.name),
                          Text(_latestSubscriber!.email),
                        ],
                      ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
