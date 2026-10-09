package com.leadmakers.schedule.ui.screens

import androidx.compose.runtime.Composable
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController

@Composable
fun AppNavigation() {
    val navController = rememberNavController()

    NavHost(navController = navController, startDestination = "login") {
        composable("login") {
            LoginScreen(
                onLoginSuccess = {
                    navController.navigate("dashboard") {
                        popUpTo("login") { inclusive = true }
                    }
                }
            )
        }
        composable("dashboard") {
            // الشاشة الرئيسية أو لوحة التحكم
            AdminDashboardScreen()
        }
        composable("edit_schedule") {
            EditScheduleScreen(
                onSaveSuccess = {
                    navController.popBackStack()
                }
            )
        }
        composable("attendance_kiosk") {
            AttendanceKioskScreen()
        }
    }
}
