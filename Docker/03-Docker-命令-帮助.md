# 03-Docker-命令-帮助

## 帮助命令

### 查看版本

    [root@centos ~]# docker version
    Client: Docker Engine - Community
     Version:           23.0.1
     API version:       1.42
     Go version:        go1.19.5
     Git commit:        a5ee5b1
     Built:             Thu Feb  9 19:49:07 2023
     OS/Arch:           linux/amd64
     Context:           default
    
    Server: Docker Engine - Community
     Engine:
      Version:          23.0.1
      API version:      1.42 (minimum version 1.12)
      Go version:       go1.19.5
      Git commit:       bc3805a
      Built:            Thu Feb  9 19:46:47 2023
      OS/Arch:          linux/amd64
      Experimental:     false
     containerd:
      Version:          1.6.18
      GitCommit:        2456e983eb9e37e47538f59ea18f2043c9a73640
     runc:
      Version:          1.1.4
      GitCommit:        v1.1.4-0-g5fd4c4d
     docker-init:
      Version:          0.19.0
      GitCommit:        de40ad0

### 查看概要信息

    [root@centos ~]# docker info
    Client:
     Context:    default
     Debug Mode: false
     Plugins:
      buildx: Docker Buildx (Docker Inc.)
        Version:  v0.10.2
        Path:     /usr/libexec/docker/cli-plugins/docker-buildx
      compose: Docker Compose (Docker Inc.)
        Version:  v2.16.0
        Path:     /usr/libexec/docker/cli-plugins/docker-compose
      scan: Docker Scan (Docker Inc.)
        Version:  v0.23.0
        Path:     /usr/libexec/docker/cli-plugins/docker-scan
    
    Server:
     Containers: 3
      Running: 0
      Paused: 0
      Stopped: 3
     Images: 2
     Server Version: 23.0.1
     Storage Driver: overlay2
      Backing Filesystem: xfs
      Supports d_type: true
      Using metacopy: false
      Native Overlay Diff: true
      userxattr: false
     Logging Driver: json-file
     Cgroup Driver: cgroupfs
     Cgroup Version: 1
     Plugins:
      Volume: local
      Network: bridge host ipvlan macvlan null overlay
      Log: awslogs fluentd gcplogs gelf journald json-file local logentries splunk syslog
     Swarm: inactive
     Runtimes: io.containerd.runc.v2 runc
     Default Runtime: runc
     Init Binary: docker-init
     containerd version: 2456e983eb9e37e47538f59ea18f2043c9a73640
     runc version: v1.1.4-0-g5fd4c4d
     init version: de40ad0
     Security Options:
      seccomp
       Profile: builtin
     Kernel Version: 4.18.0-348.7.1.el8_5.x86_64
     Operating System: CentOS Linux 8
     OSType: linux
     Architecture: x86_64
     CPUs: 2
     Total Memory: 1.674GiB
     Name: centos
     ID: 5b50c2c8-7e27-4f95-aa99-d1bcbf54c3a1
     Docker Root Dir: /var/lib/docker
     Debug Mode: false
     Registry: https://index.docker.io/v1/
     Experimental: false
     Insecure Registries:
      127.0.0.0/8
     Live Restore Enabled: false

### 查看帮助文档

    [root@centos ~]# docker --help
    
    Usage:  docker [OPTIONS] COMMAND
    
    A self-sufficient runtime for containers
    
    Common Commands:
      run         Create and run a new container from an image
      exec        Execute a command in a running container
      ps          List containers
      build       Build an image from a Dockerfile
      pull        Download an image from a registry
      push        Upload an image to a registry
      images      List images
      login       Log in to a registry
      logout      Log out from a registry
      search      Search Docker Hub for images
      version     Show the Docker version information
      info        Display system-wide information
    
    Management Commands:
      builder     Manage builds
      buildx*     Docker Buildx (Docker Inc., v0.10.2)
      compose*    Docker Compose (Docker Inc., v2.16.0)
      container   Manage containers
      context     Manage contexts
      image       Manage images
      manifest    Manage Docker image manifests and manifest lists
      network     Manage networks
      plugin      Manage plugins
      scan*       Docker Scan (Docker Inc., v0.23.0)
      system      Manage Docker
      trust       Manage trust on Docker images
      volume      Manage volumes
    
    Swarm Commands:
      swarm       Manage Swarm
    
    Commands:
      attach      Attach local standard input, output, and error streams to a running container
      commit      Create a new image from a container's changes
      cp          Copy files/folders between a container and the local filesystem
      create      Create a new container
      diff        Inspect changes to files or directories on a container's filesystem
      events      Get real time events from the server
      export      Export a container's filesystem as a tar archive
      history     Show the history of an image
      import      Import the contents from a tarball to create a filesystem image
      inspect     Return low-level information on Docker objects
      kill        Kill one or more running containers
      load        Load an image from a tar archive or STDIN
      logs        Fetch the logs of a container
      pause       Pause all processes within one or more containers
      port        List port mappings or a specific mapping for the container
      rename      Rename a container
      restart     Restart one or more containers
      rm          Remove one or more containers
      rmi         Remove one or more images
      save        Save one or more images to a tar archive (streamed to STDOUT by default)
      start       Start one or more stopped containers
      stats       Display a live stream of container(s) resource usage statistics
      stop        Stop one or more running containers
      tag         Create a tag TARGET_IMAGE that refers to SOURCE_IMAGE
      top         Display the running processes of a container
      unpause     Unpause all processes within one or more containers
      update      Update configuration of one or more containers
      wait        Block until one or more containers stop, then print their exit codes
    
    Global Options:
          --config string      Location of client config files (default "/root/.docker")
      -c, --context string     Name of the context to use to connect to the daemon (overrides DOCKER_HOST env var and default context set with "docker context use")
      -D, --debug              Enable debug mode
      -H, --host list          Daemon socket(s) to connect to
      -l, --log-level string   Set the logging level ("debug", "info", "warn", "error", "fatal") (default "info")
          --tls                Use TLS; implied by --tlsverify
          --tlscacert string   Trust certs signed only by this CA (default "/root/.docker/ca.pem")
          --tlscert string     Path to TLS certificate file (default "/root/.docker/cert.pem")
          --tlskey string      Path to TLS key file (default "/root/.docker/key.pem")
          --tlsverify          Use TLS and verify the remote
      -v, --version            Print version information and quit
    
    Run 'docker COMMAND --help' for more information on a command.
    
    For more help on how to use Docker, head to https://docs.docker.com/go/guides/

### 查看子命令帮助

    [root@centos ~]# docker ps --help
    
    Usage:  docker ps [OPTIONS]
    
    List containers
    
    Aliases:
      docker container ls, docker container list, docker container ps, docker ps
    
    Options:
      -a, --all             Show all containers (default shows just running)
      -f, --filter filter   Filter output based on conditions provided
          --format string   Format output using a custom template:
                            'table':            Print output in table format with column headers (default)
                            'table TEMPLATE':   Print output in table format using the given Go template
                            'json':             Print in JSON format
                            'TEMPLATE':         Print output using the given Go template.
                            Refer to https://docs.docker.com/go/formatting/ for more information about formatting output with templates
      -n, --last int        Show n last created containers (includes all states) (default -1)
      -l, --latest          Show the latest created container (includes all states)
          --no-trunc        Don't truncate output
      -q, --quiet           Only display container IDs
      -s, --size            Display total file sizes


# 完