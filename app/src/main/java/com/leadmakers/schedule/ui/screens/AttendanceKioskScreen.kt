package com.leadmakers.schedule.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AttendanceKioskScreen() {
    var searchQuery by remember { mutableStateOf("") }
    var selectedChild by remember { mutableStateOf<String?>(null) }

    Scaffold(
        topBar = {
            TopAppBar(title = { Text("كشك حضور الأطفال - صُنّاع القادة") })
        }
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            OutlinedTextField(
                value = searchQuery,
                onValueChange = { searchQuery = it },
                label = { Text("بحث برقم الطفل أو كود الاستلام (LM-###)") },
                modifier = Modifier.fillMaxWidth()
            )

            Button(
                onClick = {
                    // تنفيذ عملية تسجيل الحضور والتحقق من الكود
                },
                modifier = Modifier.fillMaxWidth()
            ) {
                Text("تسجيل الحضور الفوري")
            }

            Spacer(modifier = Modifier.height(8.dp))

            Text("الأطفال الحاضرون اليوم:", style = MaterialTheme.typography.titleMedium)
            
            LazyColumn(
                modifier = Modifier.fillMaxWidth(),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                item {
                    Card(modifier = Modifier.fillMaxWidth()) {
                        Column(modifier = Modifier.padding(12.dp)) {
                            Text("اسم الطفل: مثال (قيد الانتظار)")
                            Text("كود الاستلام: LM-101", style = MaterialTheme.typography.bodySmall)
                            Text("ملاحظات طبية / حساسيات: لا يوجد", color = MaterialTheme.colorScheme.secondary)
                        }
                    }
                }
            }
        }
    }
}
