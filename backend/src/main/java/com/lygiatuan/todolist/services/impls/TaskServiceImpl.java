package com.lygiatuan.todolist.services.impls;

import com.lygiatuan.todolist.dto.CreateTaskRequest;
import com.lygiatuan.todolist.enities.Task;
import com.lygiatuan.todolist.enums.TaskStatus;
import com.lygiatuan.todolist.repositories.TaskRepository;
import com.lygiatuan.todolist.services.TaskService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;

    public TaskServiceImpl(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    @Value("${page-size}")
    public String pageSize;

    @Override
    public Task createTask(CreateTaskRequest createTaskRequest) {
        Task task = new Task();
        task.setName(createTaskRequest.getName());
        task.setDescription(createTaskRequest.getDescription());
        task.setCreatedAt(new Date());
        task.setUpdatedAt(new Date());
        task.setStatus(TaskStatus.START);
        task = this.taskRepository.save(task);
        return task;
    }

    @Override
    public List<Task> getTasks(String keyword, String statusString, Boolean sortByTime, Integer page) {
        Specification<Task> nameSpec = (root, query, cb) ->
                keyword.isBlank() ? null : cb.like(root.get("name"), "%" + keyword + "%");

        Specification<Task> descriptionSpec = (root, query, cb) ->
                keyword.isBlank() ? null : cb.like(root.get("description"), "%" + keyword + "%");

        Specification<Task> statusSpec = (root, query, cb) ->
                statusString.isBlank() ? null : cb.equal(root.get("status"), TaskStatus.valueOf(statusString));

        Specification<Task> spec = Specification
                .where(nameSpec)
                .or(descriptionSpec)
                .and(statusSpec);

        Sort sort = sortByTime ? Sort.by("createdAt").ascending() : Sort.by("createdAt").descending();
        Pageable pageable = PageRequest.of(
                page,
                Integer.parseInt(pageSize),
                sort
        );

        return taskRepository.findAll(spec, pageable).getContent();
    }

    @Override
    public void deleteTask(Long id) {
        this.taskRepository.deleteById(id);
    }

    @Override
    public Task updateTask(Long id, CreateTaskRequest createTaskRequest) {
        Optional<Task> taskOptional = this.taskRepository.findById(id);
        if (taskOptional.isEmpty()) {
            throw new RuntimeException("Task not found");
        }
        Task task = taskOptional.get();
        if (createTaskRequest.getName() != null && !createTaskRequest.getName().isBlank() && !createTaskRequest.getName().equals(task.getName())) {
            task.setName(createTaskRequest.getName());
        }
        if (createTaskRequest.getDescription() != null && !createTaskRequest.getDescription().isBlank() && !createTaskRequest.getDescription().equals(task.getDescription())) {
            task.setDescription(createTaskRequest.getDescription());
        }
        task.setUpdatedAt(new Date());
        task = this.taskRepository.save(task);
        return task;
    }

    private Task getTaskAndCheckStartById(Long id) {
        Optional<Task> taskOptional = this.taskRepository.findById(id);
        if (taskOptional.isEmpty()) {
            throw new RuntimeException("Task not found");
        }
        Task task = taskOptional.get();
        if (task.getStatus() != TaskStatus.START) {
            throw new RuntimeException("Task's status is not start");
        }
        task.setUpdatedAt(new Date());
        return task;

    }

    @Override
    public Task markTaskComplete(Long id) {
        Task task = getTaskAndCheckStartById(id);
        task.setStatus(TaskStatus.COMPLETE);
        this.taskRepository.save(task);
        return task;
    }

    @Override
    public Task markTaskIncomplete(Long id) {
        Task task = getTaskAndCheckStartById(id);
        task.setStatus(TaskStatus.INCOMPLETE);
        this.taskRepository.save(task);
        return task;
    }
}
