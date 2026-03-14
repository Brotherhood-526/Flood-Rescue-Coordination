package com.rescue.backend.controller.controller.common;

import com.rescue.backend.model.service.ChatService;
import com.rescue.backend.view.dto.chat.response.ChatHistoryResponse;
import com.rescue.backend.view.dto.common.ResponseObject;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/common/chat")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

//    @GetMapping("/{requestId}")
//    public ResponseEntity<ResponseObject> getHistory(@PathVariable UUID requestId) {
//        ChatHistoryResponse history = chatService.getChatHistory(requestId);
//        return ResponseEntity.ok(new ResponseObject(200, "Tải lịch sử chat thành công", history));
//    }
}
