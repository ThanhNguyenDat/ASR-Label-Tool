DAEMON_OPTS="python3 -m uvicorn app:app --host 0.0.0.0 --port 6002 --workers 5"
LOG_FILE="output_dev.log"

case "$1" in
start)
    echo starting, log to $LOG_FILE
    $DAEMON_OPTS > $LOG_FILE 2>&1 &
    # $DAEMON_OPTS > $LOG_FILE 2>&1 | tee -a
;;

status)
    ps -ef | grep "$DAEMON_OPTS"
;;

stop)
    main_pid=$(pgrep -f "$DAEMON_OPTS")
    child_pid=$(pgrep -P "$main_pid")
    echo $main_pid
    echo $child_pid

    kill -9 $main_pid
    kill -9 $child_pid
;;

restart)
    echo restarting...
    $0 stop

    sleep 3
    echo starting...
    $0 start
;;

*)
    echo "Usage: $0 {start|stop}"
    exit 1
esac
