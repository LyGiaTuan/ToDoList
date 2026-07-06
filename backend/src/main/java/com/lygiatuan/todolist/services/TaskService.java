package com.lygiatuan.todolist.services;

import com.lygiatuan.todolist.dto.CreateTaskRequest;
import com.lygiatuan.todolist.enities.Task;

import java.util.Date;
import java.util.List;

public interface TaskService {
    Task createTask(CreateTaskRequest createTaskRequest);

    List<Task> getTasks(String keyword, String statusString, Boolean sortByTime, Integer page);

    void deleteTask(Long id);

    Task updateTask(Long id, CreateTaskRequest createTaskRequest);

    Task markTaskComplete(Long id);

    Task markTaskIncomplete(Long id);
}
