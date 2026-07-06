package com.lygiatuan.todolist.controllers;

import com.lygiatuan.todolist.dto.CreateTaskRequest;
import com.lygiatuan.todolist.enities.Task;
import com.lygiatuan.todolist.services.TaskService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping("/task")
    public ResponseEntity<List<Task>> getTasks(
            @RequestParam(name = "keyword",defaultValue = "") String keyword,
            @RequestParam(name = "statusString",defaultValue = "") String statusString,
            @RequestParam(name = "sortByTime", defaultValue = "false") Boolean sortByTime,
            @RequestParam(name = "page", defaultValue = "0") Integer page) {

        return ResponseEntity.ok(taskService.getTasks(keyword, statusString, sortByTime, page));
    }

    @PostMapping("/task")
    public ResponseEntity<Task> createTask(@Valid @RequestBody CreateTaskRequest createTaskRequest) {
        return ResponseEntity.ok(taskService.createTask(createTaskRequest));
    }

    @PatchMapping("/task/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable("id") Long id, @RequestBody CreateTaskRequest createTaskRequest) {
        return ResponseEntity.ok(taskService.updateTask(id, createTaskRequest));
    }

    @PatchMapping("/task/{id}/mark-complete")
    public ResponseEntity<Task> markTaskComplete(@PathVariable("id") Long id) {
        return ResponseEntity.ok(taskService.markTaskComplete(id));
    }

    @PatchMapping("/task/{id}/mark-incomplete")
    public ResponseEntity<Task> markTaskIncomplete(@PathVariable("id") Long id) {
        return ResponseEntity.ok(taskService.markTaskIncomplete(id));
    }

    @DeleteMapping("/task/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable("id") Long id) {
        this.taskService.deleteTask(id);
        return ResponseEntity.status(204).body(null);
    }
}
